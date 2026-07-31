import { CartSummaryProps } from "@/types/cart";

import { formatPrice } from "@/utils/formatPrice";
import { getWordEnding } from "@/utils/getWordEnding";

import { buttonStyles } from "@/app/styles";
import Bonuses from "@/app/(catalog)/catalog/[category]/(product)/[id]/_components/Bonuses";

const CartSummary = ({
  visibleItems,
  totalMaxPrice,
  totalDiscount,
  finalPrice,
  totalBonuses,
  isMinimumPriceReached,
}: CartSummaryProps) => {
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
          {!isMinimumPriceReached && (
            <div className="bg-[#d80000] rounded text-white text-xs text-center mx-auto py-0.75 px-1.5 
            mb-4 w-full">
              Минимальная сумма заказа 1000р
            </div>
          )}
          <button
            disabled={!isMinimumPriceReached || visibleItems.length === 0}
            className={`p-3 rounded mx-auto w-full text-2xl cursor-pointer ${
              isMinimumPriceReached && visibleItems.length > 0
                ? buttonStyles.active
                : buttonStyles.inactive
            }`}
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSummary;