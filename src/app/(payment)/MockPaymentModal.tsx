"use client";

import { useState } from "react";

import { TEST_CARDS } from "@/data/testCards";
import { formatPrice } from "@/utils/formatPrice";

import { MockPaymentData, PaymentSimulationResult } from "@/types/payment";

interface MockPaymentModalProps {
  amount: number;
  onClose: () => void;
  onSuccess: (paymentData: MockPaymentData) => Promise<void>;
  onError: (e: string) => void;
}

const MockPaymentModal = ({
  amount,
  onClose,
  onSuccess,
  onError,
}: MockPaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [creditCardNumber, setCreditCardNumber] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [cvv, setCVV] = useState<string>("");
  const [cardholder, setCardholder] = useState<string>("");

  const simulatePayment = async (
    simulatedResult: PaymentSimulationResult,
  ): Promise<void> => {
    try {
      setIsProcessing(true);
      await new Promise((res) => setTimeout(res, 2000));

      const dateForId = `${String(new Date().getDate()).padStart(2, "0")}_${String(new Date().getMonth() + 1).padStart(2, "0")}_${String(new Date().getFullYear()).padStart(2, "0")}`;
      const basePaymentData: Omit<MockPaymentData, "status"> = {
        id: `fake_pay_${dateForId}`,
        amount,
        cardLastFourDigits: creditCardNumber.slice(-4) || "4444",
        timestamp: new Date().toISOString(),
        paymentProcessor: "fake_payment_system",
      };

      switch (simulatedResult) {
        case "success":
          onSuccess({ ...basePaymentData, status: "succeeded" });
          onClose();
          break;
        case "failure":
          onError("Недостаточно средств на карте");
          break;
        case "error":
          onError("Ошибка банка-эмитента. Попробуйте позже");
          break;
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : "Неизвестная ошибка";
      console.error("Ошибка при симуляции оплаты: ", error);
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardNumberChange = (cc: string): void => {
    const formatted = cc
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
    setCreditCardNumber(formatted);
  };

  const handleExpirationDateChange = (date: string): void => {
    const formatted = date
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/g, "$1/$2")
      .slice(0, 5);
    setExpirationDate(formatted);
  };

  const handleCVVChange = (cvv: string): void =>
    setCVV(cvv.replace(/\D/g, "").slice(0, 3));

  const handleFormSubmit = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();
    const testCard = TEST_CARDS.find((card) =>
      creditCardNumber
        .replace(/\s/g, "")
        .includes(card.number.replace(/\s/g, "")),
    );
    const result = testCard?.result || "error";
    simulatePayment(result);
  };

  const fillTestCard = (
    ccNumber: string,
    result: PaymentSimulationResult,
  ): void => {
    setCreditCardNumber(ccNumber.replace(/\s/g, ""));
    setExpirationDate("11/30");
    setCVV("123");
    setCardholder("IVAN ZOLO");
    setTimeout(() => simulatePayment(result), 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Тестовая оплата</h2>
        <p className="text-gray-600 mb-4">Сумма: {amount} ₽</p>
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h3 className="text-sm font-medium mb-2">
            Тестовые карты (авто-оплата):
          </h3>
          {TEST_CARDS.map((card, index) => (
            <button
              key={index}
              type="button"
              onClick={() => fillTestCard(card.number, card.result)}
              disabled={isProcessing}
              className="block w-full text-left p-2 hover:bg-gray-100 rounded text-sm mb-1 disabled:opacity-50 
              disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="font-mono">{card.number}</span>
              <span className="text-gray-500 ml-2">- {card.description}</span>
            </button>
          ))}
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Номер карты
            </label>
            <input
              type="text"
              value={creditCardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder="0000 0000 0000 0000"
              className="w-full p-2 border rounded font-mono"
              required
              maxLength={19}
              disabled={isProcessing}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Срок действия
              </label>
              <input
                type="text"
                value={expirationDate}
                onChange={(e) => handleExpirationDateChange(e.target.value)}
                placeholder="ММ/ГГ"
                className="w-full p-2 border rounded"
                required
                maxLength={5}
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVC</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => handleCVVChange(e.target.value)}
                placeholder="123"
                className="w-full p-2 border rounded"
                required
                maxLength={3}
                disabled={isProcessing}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Имя держателя
            </label>
            <input
              type="text"
              value={cardholder}
              onChange={(e) => setCardholder(e.target.value.toUpperCase())}
              placeholder="IVAN IVANOV"
              className="w-full p-2 border rounded uppercase"
              required
              disabled={isProcessing}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 
              disabled:opacity-50 duration-300 cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={
                isProcessing ||
                !creditCardNumber ||
                !expirationDate ||
                !cvv ||
                !cardholder
              }
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 
              disabled:cursor-not-allowed duration-300 cursor-pointer"
            >
              {isProcessing
                ? "Обработка..."
                : `Оплатить ${formatPrice(amount)} ₽`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MockPaymentModal;
