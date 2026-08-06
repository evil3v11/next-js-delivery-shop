"use client";

import { formatPrice } from "@/utils/formatPrice";

import { PaymentSuccessData } from "@/types/payment";

const PaymentSuccessModal = ({
  onClose,
  successData,
}: {
  onClose: () => void;
  successData: PaymentSuccessData | null;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Оплата прошла успешно!
        </h2>
        <div className="space-y-3 mb-6 text-left bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="text-gray-600">Номер заказа:</span>
            <span className="font-semibold">{successData?.orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ID платежа:</span>
            <span className="font-mono text-sm text-right">{successData?.paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Сумма:</span>
            <span className="font-semibold">
              {formatPrice(successData?.amount || 0)} ₽
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Карта:</span>
            <span className="font-mono">**** {successData?.cardLastFourDigits}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-6">
          Ваш заказ успешно оплачен и передан в обработку. В ближайшее время с
          Вами свяжется наш менеджер для подтверждения доставки.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 
          transition-colors font-medium cursor-pointer"
        >
          Понятно
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
