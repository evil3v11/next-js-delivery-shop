import { CartSidebarProps } from "@/types/cart";

import BonusesSection from "./BonusesSection";
import CartSummary from "../../../../components/CartSummary";

const CartSidebar = ({ deliveryData, productsData }: CartSidebarProps) => {
  return (
    <div className="flex flex-col gap-y-6 md:w-63.75 xl:w-68">
      <BonusesSection />
      <CartSummary deliveryData={deliveryData} productsData={productsData} />
    </div>
  );
};

export default CartSidebar;
