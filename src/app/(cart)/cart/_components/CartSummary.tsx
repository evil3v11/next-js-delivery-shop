"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

import { createOrderAction } from "@/actions/createOrderAction";

import { CartSidebarProps } from "@/types/cart";
import { CartItemWithPrice } from "@/types/order";

import { CONFIG } from "../../../../../config/config";
import { formatPrice } from "@/utils/formatPrice";
import { getWordEnding } from "@/utils/getWordEnding";
import { calculateFinalPrice, calculatePriceByCard } from "@/utils/calculateProductPrice";

import { buttonStyles } from "@/app/styles";

import Bonuses from "@/app/(catalog)/catalog/[category]/(product)/[id]/_components/Bonuses";
import OrderSuccessMessage from "./OrderSuccessMessage";

const CartSummary = ({ deliveryData, productsData }: CartSidebarProps) => {
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    pricing,
    cart,
    hasLoyaltyCard,
    isCheckout,
    setIsCheckout,
    isOrdered,
    setIsOrdered,
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

  const handleOnlinePayment = () => {
    if (!deliveryData) {
      console.error("Данные доставки не заполнены");
      return;
    }
    // TODO: Add online payment option
  };
  
  const handleCashPayment = async () => {
    if (!deliveryData) {
      console.error("Данные доставки не заполнены");
      return;
    }

    try {
      setIsProcessing(true);

      const cartItemsWithPrices: CartItemWithPrice[] = visibleItems.map(
        ({ productId, quantity }) => {
          const { basePrice, discountPercent } = productsData[productId];
          if (!productsData[productId]) {
            return {
              productId,
              quantity,
              price: 0,
            };
          }

          const discountedPrice = calculateFinalPrice(
            basePrice,
            discountPercent || 0,
          );
          const finalPrice = hasLoyaltyCard
            ? calculatePriceByCard(
                discountedPrice,
                CONFIG.CARD_DISCOUNT_PERCENT,
              )
            : discountedPrice;

          return {
            productId,
            quantity,
            price: finalPrice,
            basePrice,
            discountPercent: discountPercent || 0,
            hasLoyaltyDiscount: hasLoyaltyCard,
          };
        },
      );

      const { orderNumber } = await createOrderAction({
        finalPrice,
        totalBonuses,
        maxBonusAmountToUse,
        totalDiscount,
        deliveryAddress: deliveryData.address,
        deliveryTime: deliveryData.time,
        cartItems: cartItemsWithPrices,
        totalPrice: totalMaxPrice,
        paymentMethod: "cash_on_delivery",
      });

      setOrderNumber(orderNumber);
      setIsOrdered(true);
    } catch (e) {
      console.log("Ошибка при создании заказа: ", e);
      alert(
        `Ошибка при оформлении заказа: ${e instanceof Error ? e.message : "Неизвестная ошибка"}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-2.5 pb-6 border-b-2 border-[#f3f2f1]">
        <div className="flex justify-between">
          <p className="text-[#8f8f8f]">
            {visibleItems.length} {`товар${getWordEnding(visibleItems.length)}`}
          </p>
          <p className="">{formatPrice(totalMaxPrice)} ₽</p>
        </div>
        <div className="flex justify-between">
          <p className="text-[#8f8f8f]">Скидка</p>
          <p className="text-secondary font-bold">
            -{formatPrice(totalDiscount)} ₽
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between gap-y-6">
        <div className="text-base text-[#8f8f8f] flex justify-between items-center w-full">
          <span>Итог:</span>
          <span className="font-bold text-2xl text-main-text">
            {formatPrice(finalPrice)} ₽
          </span>
        </div>
        <Bonuses bonus={totalBonuses} />
        <div className="w-full">
          {!isMinimumReached && (
            <div
              className="bg-[#d80000] rounded text-white text-xs text-center mx-auto py-0.75 px-1.5 
            mb-4 w-full"
            >
              Минимальная сумма заказа 1000р
            </div>
          )}
          {!isCheckout ? (
            <button
              onClick={() => setIsCheckout(true)}
              disabled={!isMinimumReached || visibleItems.length === 0}
              className={`p-3 rounded mx-auto w-full text-2xl cursor-pointer ${
                isMinimumReached && visibleItems.length > 0
                  ? buttonStyles.active
                  : buttonStyles.inactive
              }`}
            >
              Оформить заказ
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              {!isOrdered ? (
                <>
                  <button
                    disabled={!canProceedWithPayment()}
                    onClick={handleOnlinePayment}
                    className={`rounded w-full text-xl h-15 items-center justify-center ${
                      canProceedWithPayment()
                        ? buttonStyles.active
                        : buttonStyles.inactive
                    }`}
                  >
                    {isProcessing ? "Обработка..." : "Оплатить на сайте"}
                  </button>
                  <button
                    disabled={!canProceedWithPayment()}
                    onClick={handleCashPayment}
                    className={`h-10 rounded w-full text-base items-center justify-center duration-300 ${
                      canProceedWithPayment()
                        ? "bg-primary hover:shadow-button-default active:shadow-button-active text-white cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isProcessing ? "Оформление..." : "Оплатить при получении"}
                  </button>
                </>
              ) : (
                <OrderSuccessMessage orderNumber={orderNumber} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSummary;
