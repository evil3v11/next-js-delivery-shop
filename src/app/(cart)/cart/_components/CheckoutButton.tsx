"use client";

import { useCartStore } from "@/store/cartStore";

import { buttonStyles } from "@/app/styles";

const CheckoutButton = ({
  isMinimumReached,
  visibleItemsAmount,
}: {
  isMinimumReached: boolean;
  visibleItemsAmount: number;
}) => {
  const { setIsCheckout } = useCartStore();
  return (
    <button
      onClick={() => setIsCheckout(true)}
      disabled={!isMinimumReached || visibleItemsAmount === 0}
      className={`p-3 rounded mx-auto w-full text-2xl cursor-pointer ${
        isMinimumReached && visibleItemsAmount > 0
          ? buttonStyles.active
          : buttonStyles.inactive
      }`}
    >
      Оформить заказ
    </button>
  );
};

export default CheckoutButton;
