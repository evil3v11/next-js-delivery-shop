"use client";

import { Activity } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

import { CONFIG } from "../../../../../config/config";
import { getWordEnding } from "@/utils/getWordEnding";

import InStockToggle from "@/components/InStockToggle";

const BonusesSection = () => {
  const { pricing, doesUseBonuses, setDoesUseBonuses, isOrdered } =useCartStore();
  const { user } = useAuthStore();
  const { totalPrice, maxBonusUse } = pricing;
  if (maxBonusUse <= 0) return null;

  const isCardValid = user?.hasNoCard && user.card?.trim().length === 16;
  return (
    <Activity mode={isCardValid ? "visible" : "hidden"}>
      <div className="flex flex-col gap-y-5 text-base pb-6 border-b-2 border-[#f3f2f1]">
        <div className="flex flex-row items-center gap-x-2.5">
          <InStockToggle
            inStock={doesUseBonuses}
            handleInStockChange={isOrdered ? () => {} : setDoesUseBonuses}
          />
          <p>
            Списать{" "}
            {Math.min(
              maxBonusUse,
              Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENTAGE) / 100),
            )}{" "}
            ₽
          </p>
        </div>
        <div className="text-[#8f8f8f]">
          {`На карте накоплено ${maxBonusUse} бонус${getWordEnding(maxBonusUse)}`}
        </div>
      </div>
    </Activity>
  );
};

export default BonusesSection;
