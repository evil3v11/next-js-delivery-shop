import { formatPrice } from "@/utils/formatPrice";
import { getWordEnding } from "@/utils/getWordEnding";

import { CartItem } from "@/types/cart";
import Bonuses from "@/app/(catalog)/catalog/[category]/(product)/[slug]/_components/Bonuses";

interface PriceSummaryProps {
  visibleItems: CartItem[];
  totalMaxPrice: number;
  totalDiscount: number;
  finalPrice: number;
  totalBonuses: number;
}

const PriceSummary = ({
  visibleItems,
  totalMaxPrice,
  totalDiscount,
  finalPrice,
  totalBonuses
}: PriceSummaryProps) => {
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
      </div>
    </>
  );
};

export default PriceSummary;
