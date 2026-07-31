import { CONFIG } from "../../../../../config/config";

import { getWordEnding } from "@/utils/getWordEnding";

import InStockToggle from "@/components/InStockToggle";

interface BonusesSectionProps {
  bonusesAmount: number;
  doesUseBonuses: boolean;
  onDoesUseBonusesChange: (value: boolean) => void;
  totalPrice: number;
}

const BonusesSection = ({
  bonusesAmount,
  doesUseBonuses,
  onDoesUseBonusesChange,
  totalPrice,
}: BonusesSectionProps) => {
  if (bonusesAmount <= 0) return null;

  return (
    <div className="flex flex-col gap-y-5 text-base pb-6 border-b-2 border-[#f3f2f1]">
      <div className="flex flex-row items-center gap-x-2.5">
        <InStockToggle
          inStock={doesUseBonuses}
          handleInStockChange={onDoesUseBonusesChange}
        />
        <p>
          Списать{" "}
          {Math.min(
            bonusesAmount,
            Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENTAGE) / 100),
          )}{" "}
          ₽
        </p>
      </div>
      <div className="text-[#8f8f8f]">
        {`На карте накоплено ${bonusesAmount} бонус${getWordEnding(bonusesAmount)}`}
      </div>
    </div>
  );
};

export default BonusesSection;
