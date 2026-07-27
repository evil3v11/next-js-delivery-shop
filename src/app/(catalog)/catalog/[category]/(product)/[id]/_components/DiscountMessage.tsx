"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

import { unsubscribeFromPriceAlert } from "@/actions/priceAlerts";

import IconBell from "@/components/svg/IconBell";
import PriceAlertModal from "./PriceAlertModal";

interface DiscountMessageProps {
  productId: string;
  productTitle: string;
  currentPrice: string;
  initialIsSubscribed?: boolean;
  unsubscribeToken?: string;
}

const DiscountMessage = ({
  productId,
  productTitle,
  currentPrice,
  initialIsSubscribed = false,
  unsubscribeToken: initialUnsubToken,
}: DiscountMessageProps) => {
  const { isAuth } = useAuthStore();
  const [notification, setNotification] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [unsubToken, setUnsubToken] = useState<string>(initialUnsubToken || "");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => {
        setNotification("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  const handleOpenModal = (): void => {
    if (!isAuth) {
      setNotification(
        "Подписка доступна только для авторизованных пользователей",
      );
      return;
    }

    if (isSubscribed) {
      setNotification("Вы уже подписаны на уведомление");
      return;
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => setIsModalOpen(false);

  const handleSubscribeSuccess = (token: string): void => {
    setIsSubscribed(true);
    setUnsubToken(token);
    setNotification("Вы успешно подписались на уведомления");
  };

  const handleUnsubscribe = async (): Promise<void> => {
    if (!unsubToken) return;

    try {
      setIsLoading(true);

      const unsubResult = await unsubscribeFromPriceAlert(unsubToken);

      if (unsubResult.success) {
        setIsSubscribed(false);
        setNotification("Вы отписались от уведомления");
      } else if (unsubResult.error) {
        setNotification(unsubResult.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      {notification && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-primary text-white px-6 py-3 rounded shadow-md">
            {notification}
          </div>
        </div>
      )}
      {isSubscribed ? (
        <button
          onClick={handleUnsubscribe}
          disabled={isLoading}
          className="flex items-center gap-2 p-2 mb-6 text-[#606060] text-xs cursor-pointer"
        >
          <IconBell />
          {isLoading ? "Отписка..." : "Отписаться от уведомления"}
        </button>
      ) : (
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 p-2 mb-6 text-[#606060] text-xs cursor-pointer"
        >
          <IconBell  isCrossed={false} />
          Уведомить о снижении цены
        </button>
      )}
      {isModalOpen && (
        <PriceAlertModal
          onCloseAction={handleCloseModal}
          productId={productId}
          productTitle={productTitle}
          currentPrice={currentPrice}
          onSuccessAction={handleSubscribeSuccess}
        />
      )}
    </div>
  );
};

export default DiscountMessage;
