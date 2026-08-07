"use client";

import { Activity, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

import { CONFIG } from "../../../../../config/config";
import {
  confirmOrderPayment,
  createOrderRequest,
  prepareCartItemsWithPrices,
  updateUserAfterPayment,
} from "../_utils/orderHelperFunctions";

import { ObjectId } from "mongodb";
import { CartSidebarProps } from "@/types/cart";
import { MockPaymentData, PaymentSuccessData } from "@/types/payment";
import { CreateOrderSuccess, OrderPaymentMethod } from "@/types/order";

import PriceSummary from "./PriceSummary";
import MinimumPriceWarning from "./MinimumPriceWarning";
import CheckoutButton from "./CheckoutButton";
import PaymentButtons from "./PaymentButtons";
import MockPaymentModal from "../../../(payment)/MockPaymentModal";
import PaymentSuccessModal from "@/app/(payment)/PaymentSuccessModal";

const CartSummary = ({ deliveryData, productsData }: CartSidebarProps) => {
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<ObjectId | null>(null)
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
  ): Promise<CreateOrderSuccess> => {
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

  const handlePaymentResult = async (
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

      if (paymentMethod === "online") {
        if (paymentData?.status === 'succeeded') {
          await confirmOrderPayment(currentOrderId!)
          await updateUserAfterPayment({
            usedBonuses: actualMaxBonusAmountToUse,
            earnedBonuses: totalBonuses,
            purchasedProductIds: visibleItems.map((i) => i.productId),
          });
        }

        const successModalData: PaymentSuccessData = {
          orderNumber: orderNumber!,
          paymentId: paymentData!.id,
          amount: finalPrice,
          cardLastFourDigits: paymentData!.cardLastFourDigits,
        };
  
        setSuccessModalData(successModalData);
        setShowSuccessModal(true);
      } else {
        const result = await createOrder(paymentMethod, paymentData?.id)
        setOrderNumber(result.orderNumber)
      }
      setIsOrdered(true)
    } catch (e) {
      console.error(`Ошибка: `, e);
      alert(`Ошибка при обработке заказа`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOnlinePayment = async (): Promise<void> => {
    if (!deliveryData) {
      console.error("Данные доставки не заполнены");
      return;
    }
    
    try {
      setIsProcessing(true)

      if (currentOrderId && orderNumber) {
        setShowPaymentModal(true);
      } else {
        const result = await createOrder("online")
        setOrderNumber(result.orderNumber)
        setCurrentOrderId(result.order._id)
        setShowPaymentModal(true);
      }
    } catch (e) {
      console.error("Ошибка при создании заказа: ", e)
      alert("Ошибка при создании заказа")
    } finally {
      setIsProcessing(false)
    }
  };

  const handleCashPayment = async (): Promise<void> => {
    try {
      await handlePaymentResult("cash");
    } catch (e) {
      console.error("Ошибка обработки заказа: ", e)
    }
  } 

  const handleClosePaymentModal = (): void => setShowPaymentModal(false);

  const handlePaymentSuccess = async (paymentData: MockPaymentData): Promise<void> => {
     try {
      await handlePaymentResult("online", paymentData);
    } catch (e) {
      console.error("Ошибка обработки заказа: ", e)
    }
  } 

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
