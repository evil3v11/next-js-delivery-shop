import BonusesSection from "./BonusesSection";
import CartSummary from "./CartSummary";

import { CartSidebarProps } from "@/types/cart";

const CartSidebar = ({
  bonusesAmount,
  doesUseBonuses,
  setDoesUseBonuses,
  totalPrice,
  visibleItems,
  totalMaxPrice,
  totalDiscount,
  finalPrice,
  totalBonuses,
  isMinimumPriceReached,
}: CartSidebarProps) => {
  return (
    <div className="flex flex-col gap-y-6 md:w-63.75 xl:w-68">
      <BonusesSection
        bonusesAmount={bonusesAmount}
        doesUseBonuses={doesUseBonuses}
        onDoesUseBonusesChange={setDoesUseBonuses}
        totalPrice={totalPrice}
      />
      <CartSummary
        visibleItems={visibleItems}
        totalMaxPrice={totalMaxPrice}
        totalDiscount={totalDiscount}
        finalPrice={finalPrice}
        totalBonuses={totalBonuses}
        isMinimumPriceReached={isMinimumPriceReached}
      />
    </div>
  );
};

export default CartSidebar;
