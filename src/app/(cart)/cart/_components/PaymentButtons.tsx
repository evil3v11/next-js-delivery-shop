"use client";

import { OrderPaymentMethod } from "@/types/order";

import { buttonStyles } from "@/app/styles";

import OrderSuccessMessage from "./OrderSuccessMessage";

interface PaymentButtonsProps {
  canProceedWithPayment: boolean;
  handleOnlinePayment: () => void;
  handleCashPayment: () => Promise<void>;
  isProcessing: boolean;
  isOrdered: boolean;
  orderNumber: string | null;
  paymentMethod: OrderPaymentMethod | null;
}

const PaymentButtons = ({
  canProceedWithPayment,
  handleOnlinePayment,
  handleCashPayment,
  isProcessing,
  isOrdered,
  orderNumber,
  paymentMethod,
}: PaymentButtonsProps) => {
  if (isOrdered && paymentMethod === "cash") return <OrderSuccessMessage orderNumber={orderNumber} />;
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        disabled={!canProceedWithPayment}
        onClick={handleOnlinePayment}
        className={`rounded w-xs text-xl h-15 items-center justify-center cursor-pointer ${
          canProceedWithPayment ? buttonStyles.active : buttonStyles.inactive
        }`}
      >
        {isProcessing ? "Обработка..." : "Оплатить на сайте"}
      </button>
      <button
        disabled={!canProceedWithPayment}
        onClick={handleCashPayment}
        className={`h-10 rounded w-xs text-base items-center justify-center duration-300 ${
          canProceedWithPayment
            ? "bg-primary hover:shadow-button-default active:shadow-button-active text-white cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isProcessing ? "Оформление..." : "Оплатить при получении"}
      </button>
    </div>
  );
};

export default PaymentButtons;
