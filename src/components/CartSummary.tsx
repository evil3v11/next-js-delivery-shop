"use client";

import { Activity, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

import { CONFIG } from "../../config/config";
import {
  clearUserCart,
  createOrderRequest,
  markPaymentAsFailed,
  prepareCartItemsWithPrices,
  updateUserAfterPayment,
} from "../app/(cart)/cart/_utils/orderHelperFunctions";

import { ObjectId } from "mongodb";
import { CartSummaryProps } from "@/types/cart";
import { MockPaymentData, PaymentSuccessData } from "@/types/payment";
import { CreateOrderSuccess, OrderPaymentMethod } from "@/types/order";

import PriceSummary from "../app/(cart)/cart/_components/PriceSummary";
import MinimumPriceWarning from "../app/(cart)/cart/_components/MinimumPriceWarning";
import CheckoutButton from "../app/(cart)/cart/_components/CheckoutButton";
import PaymentButtons from "../app/(cart)/cart/_components/PaymentButtons";
import MockPaymentModal from "../app/(payment)/MockPaymentModal";
import PaymentSuccessModal from "@/app/(payment)/PaymentSuccessModal";

const CartSummary = ({
  deliveryData,
  productsData,
  isReorder = false,
  customCartItems,
  customPricing,
  onOrderSuccess
}: CartSummaryProps) => {
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<ObjectId | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod | null>(
    null,
  );
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [successModalData, setSuccessModalData] =
    useState<PaymentSuccessData | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const router = useRouter();

  const { user } = useAuthStore();

  const {
    pricing,
    cart,
    hasLoyaltyCard,
    isCheckout,
    isOrdered,
    setIsOrdered,
    doesUseBonuses,
    resetAfterOrder,
    updatePricing,
  } = useCartStore();

  const currentPricing = isReorder && customPricing ? customPricing : pricing;
  
  const {
    totalPrice,
    totalMaxPrice,
    totalDiscount,
    finalPrice,
    totalBonuses,
    isMinimumReached,
    maxBonusAmount,
  } = currentPricing;

  const visibleItems =
    isReorder && customCartItems
      ? customCartItems
      : cart.filter((item) => item.quantity > 0);
  
  const maxBonusAmountToUse = Math.min(
    maxBonusAmount,
    Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENTAGE) / 100),
  );

  const actualHasLoyaltyCard = !!(user?.card && user.hasNoCard);
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

    if (isReorder) updatePricing({ ...currentPricing, totalBonuses });

    const effectiveHasLoyaltyCard = isReorder
      ? actualHasLoyaltyCard
      : hasLoyaltyCard;

    const cartItemsWithPrices = prepareCartItemsWithPrices(
      visibleItems,
      productsData,
      effectiveHasLoyaltyCard,
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
        if (paymentData?.status === "succeeded") {
          await updateUserAfterPayment({
            orderId: currentOrderId!,
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
        setIsOrdered(true)

        await clearUserCart()
      } else {
        const result = await createOrder(paymentMethod, paymentData?.id);
        await clearUserCart()
        setOrderNumber(result.orderNumber);
        setIsOrdered(true)
      }
      setIsOrdered(true);
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
      setIsProcessing(true);

      const result = await createOrder("online");
      setOrderNumber(result.orderNumber);
      setCurrentOrderId(result.order._id);
      setShowPaymentModal(true);
    } catch (e) {
      console.error("Ошибка при создании заказа: ", e);
      alert("Ошибка при создании заказа");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashPayment = async (): Promise<void> => {
    try {
      await handlePaymentResult("cash");
    } catch (e) {
      console.error("Ошибка обработки заказа: ", e);
    }
  };

  const handleClosePaymentModal = (): void => setShowPaymentModal(false);

  const handlePaymentSuccess = async (
    paymentData: MockPaymentData,
  ): Promise<void> => {
    try {
      await handlePaymentResult("online", paymentData);
      setShowPaymentModal(false)
    } catch (e) {
      console.error("Ошибка обработки заказа: ", e);
    }
  };

  const handlePaymentError = async (e: string): Promise<void> => {
    setShowPaymentModal(false);

    if (currentOrderId) await markPaymentAsFailed(String(currentOrderId))
    else console.error("ID заказа не найден для отметки платежа как неудачного")
  
    alert(`Ошибка оплаты: ${e}`);
    resetAfterOrder()
    await clearUserCart()
    router.push('/orders')
  };

  const handleCloseSuccessModal = (): void => {
    setShowSuccessModal(false);
    if (isReorder && onOrderSuccess) onOrderSuccess()
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
        {isCheckout || isReorder ? (
          <PaymentButtons
            isOrdered={isOrdered}
            canProceedWithPayment={canProceedWithPayment()}
            handleOnlinePayment={handleOnlinePayment}
            handleCashPayment={handleCashPayment}
            isProcessing={isProcessing}
            orderNumber={orderNumber}
            paymentMethod={paymentMethod}
          />
        ) : (
          <CheckoutButton
            isMinimumReached={isMinimumReached}
            visibleItemsAmount={visibleItems.length}
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
