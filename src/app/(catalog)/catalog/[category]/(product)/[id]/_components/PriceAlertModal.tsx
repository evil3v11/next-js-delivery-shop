"use client";

import { useActionState, useEffect } from "react";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { createPriceAlert, PriceAlertFormState } from "@/actions/priceAlerts";

interface PriceAlertModalProps {
  onCloseAction: () => void;
  productId: string;
  productTitle: string;
  currentPrice: string;
  onSuccessAction: (token: string) => void;
}

const PriceAlertModal = ({
  onCloseAction,
  productId,
  productTitle,
  currentPrice,
  onSuccessAction,
}: PriceAlertModalProps) => {
  const [state, formAction, isPending] = useActionState(
    handleSubmit,
    {} as PriceAlertFormState,
  );

  const modalRef = useClickOutsideModal<HTMLDivElement>(() => onCloseAction());

  useEffect(() => {
    if (state.success && state.unsubscribeToken) {
      onSuccessAction(state.unsubscribeToken);
      onCloseAction();
    }
  }, [state, onSuccessAction, onCloseAction]);

  async function handleSubmit(
    prevState: PriceAlertFormState | null,
    formData: FormData,
  ): Promise<PriceAlertFormState> {
    formData.append("productId", productId);
    formData.append("productTitle", productTitle);
    formData.append("currentPrice", currentPrice);

    return createPriceAlert(prevState, formData);
  }

  return (
    <div
      className="fixed inset-0 bg-secondary/20 min-h-screen z-50 backdrop-blur-lg flex items-center 
    justify-center p-5"
    >
      <div
        ref={modalRef}
        className="flex flex-col justify-center items-center gap-y-5 p-10 bg-white rounded"
      >
        <h3 className="text-lg font-bold">Уведомление о снижении цены</h3>
        <form action={formAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-y-5">
            <input
              type="email"
              name="email"
              required
              placeholder="Ваш email"
              disabled={isPending}
              className={`p-2 rounded text-sm relative border border-primary`}
            />
            {state.errors?.email && (
              <p className="text-[#d80000] text-xs">{state.errors.email}</p>
            )}
          </div>
          {state.errors?.general && (
            <p className="text-[#d80000] text-xs">{state.errors.general}</p>
          )}
          <div className="flex justify-between gap-x-5">
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded bg-primary hover:bg-primary/80 text-white duration-300 cursor-pointer"
            >
              {isPending ? "Подписываюсь..." : "Подписаться"}
            </button>
            <button
              type="button"
              onClick={onCloseAction}
              disabled={isPending}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-800/80 text-main-text hover:text-white duration-300 cursor-pointer"
            >
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceAlertModal;
