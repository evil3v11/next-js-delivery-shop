"use client";

import { Activity, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

import { CONFIG } from "../../../../../config/config";
import {
  createOrderRequest,
  prepareCartItemsWithPrices,
  updateUserAfterPayment,
} from "../_utils/orderHelperFunctions";

import { CartSidebarProps } from "@/types/cart";
import { MockPaymentData, PaymentSuccessData } from "@/types/payment";
import { CreateOrderResponse, OrderPaymentMethod } from "@/types/order";

import PriceSummary from "./PriceSummary";
import MinimumPriceWarning from "./MinimumPriceWarning";
import CheckoutButton from "./CheckoutButton";
import PaymentButtons from "./PaymentButtons";
import MockPaymentModal from "../../../(payment)/MockPaymentModal";
import PaymentSuccessModal from "@/app/(payment)/PaymentSuccessModal";

const CartSummary = ({ deliveryData, productsData }: CartSidebarProps) => {
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [successModalData, setSuccessModalData] = useState<PaymentSuccessData | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const router = useRouter()

  const {
    pricing,
    cart,
    hasLoyaltyCard,
    isCheckout,
    isOrdered,
    setIsOrdered,
    doesUseBonuses,
    resetAfterOrder,
  } = useCartStore();
  const {
    totalPrice,
    totalMaxPrice,
    totalDiscount,
    finalPrice,
    totalBonuses,
    isMinimumReached,
    maxBonusUse,
  } = pricing;

  const visibleItems = cart.filter((item) => item.quantity > 0);
  const maxBonusAmountToUse = Math.min(
    maxBonusUse,
    Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENTAGE) / 100),
  );

  const actualMaxBonusAmountToUse = doesUseBonuses ? maxBonusAmountToUse : 0;

  const isDataValid = (): boolean => {
    if (!deliveryData) return false;

    const { address, time } = deliveryData;
    const isAddressValid = !!(
      address.city.trim() &&
      address.street.trim() &&
      address.house.trim()
    );
    const isTimeValid = !!(time.date.trim() && time.timeSlot.trim());

    return (
      isAddressValid &&
      isTimeValid &&
      isMinimumReached &&
      visibleItems.length > 0
    );
  };

  const canProceedWithPayment = (): boolean => isDataValid() && !isProcessing;

  const createOrder = async (
    paymentMethod: OrderPaymentMethod,
    paymentId?: string,
  ): Promise<CreateOrderResponse> => {
    if (!deliveryData) throw new Error("Данные доставки не заполнены");

    const cartItemsWithPrices = prepareCartItemsWithPrices(
      visibleItems,
      productsData,
      hasLoyaltyCard,
    );

    const orderData = {
      finalPrice,
      totalBonuses,
      maxBonusAmountToUse: actualMaxBonusAmountToUse,
      totalDiscount,
      deliveryAddress: deliveryData.address,
      deliveryTime: deliveryData.time,
      cartItems: cartItemsWithPrices,
      totalPrice: totalMaxPrice,
      paymentMethod,
      paymentId,
    };

    return await createOrderRequest(orderData);
  };

  const handleOrderCreation = async (
    paymentMethod: OrderPaymentMethod,
    paymentData?: MockPaymentData,
  ): Promise<void> => {
    if (!deliveryData) {
      console.error("Данные доставки не заполнены");
      return;
    }

    try {
      setIsProcessing(true);
      setPaymentMethod(paymentMethod);

      const result = await createOrder(paymentMethod, paymentData?.id);
      console.log(result)
      if (paymentMethod === "online") {
        try {
          await updateUserAfterPayment({
            usedBonuses: actualMaxBonusAmountToUse,
            earnedBonuses: totalBonuses,
            purchasedProductIds: visibleItems.map((i) => i.productId),
          });
        } catch (e) {
          console.warn(
            "Заказ создан, но возникла проблема с обновлением бонусов: ",
            e,
          );
        }

        const successModalData: PaymentSuccessData = {
          orderNumber: result.orderNumber!,
          paymentId: paymentData!.id,
          amount: finalPrice,
          cardLastFourDigits: paymentData!.cardLastFourDigits,
        };
  
        setSuccessModalData(successModalData);
        setShowSuccessModal(true);
      }

      if (result.orderNumber) setOrderNumber(result.orderNumber)
      setIsOrdered(true)
    } catch (e) {
      console.error(`Ошибка при создании ${paymentMethod} заказа: `, e);
      alert(
        `Ошибка при оформлении заказа: ${e instanceof Error ? e.message : "Неизвестная ошибка"}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOnlinePayment = (): void => {
    if (!deliveryData) {
      console.error("Данные доставки не заполнены");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleCashPayment = async () => await handleOrderCreation("cash");

  const handleClosePaymentModal = (): void => setShowPaymentModal(false);
  const handlePaymentSuccess = async (
    paymentData: MockPaymentData,
  ): Promise<void> => await handleOrderCreation("online", paymentData);

  const handlePaymentError = (e: string): void => {
    setShowPaymentModal(false);
    alert(`Ошибка оплаты: ${e}`);
  };

  const handleCloseSuccessModal = (): void => {
    setShowSuccessModal(false);
    setIsOrdered(true);
    resetAfterOrder();
    router.push("/orders");
  };

  return (
    <>
      <PriceSummary
        visibleItems={visibleItems}
        totalMaxPrice={totalMaxPrice}
        totalDiscount={totalDiscount}
        finalPrice={finalPrice}
        totalBonuses={totalBonuses}
      />
      <div className="w-full">
        {!isMinimumReached && <MinimumPriceWarning />}
        {!isCheckout ? (
          <CheckoutButton
            isMinimumReached={isMinimumReached}
            visibleItemsAmount={visibleItems.length}
          />
        ) : (
          <PaymentButtons
            isOrdered={isOrdered}
            canProceedWithPayment={canProceedWithPayment()}
            handleOnlinePayment={handleOnlinePayment}
            handleCashPayment={handleCashPayment}
            isProcessing={isProcessing}
            orderNumber={orderNumber}
            paymentMethod={paymentMethod}
          />
        )}
      </div>
      <Activity mode={showPaymentModal ? "visible" : "hidden"}>
        <MockPaymentModal
          amount={totalPrice}
          onClose={handleClosePaymentModal}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </Activity>
      <Activity mode={showSuccessModal ? "visible" : "hidden"}>
        <PaymentSuccessModal
          onClose={handleCloseSuccessModal}
          successData={successModalData}
        />
      </Activity>
    </>
  );
};

export default CartSummary;
