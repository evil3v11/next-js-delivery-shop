import { ProductCardProps } from "./product";

export type CartItem = {
  productId: string;
  quantity: number;
  addedAt: Date;
};

export interface CartItemProps {
  item: CartItem;
  productData: ProductCardProps;
  isSelected: boolean;
  onSelectionChange: (productId: string, isSelected: boolean) => void;
  onQuantityUpdate: (productId: string, newQuantity: number) => Promise<void>;
  hasLoyaltyCard: boolean;
}

export interface CartBonusesSectionProps {
  bonusesAmount: number;
  doesUseBonuses: boolean;
  setDoesUseBonuses: (value: boolean) => void;
  totalPrice: number;
}

export interface CartSummaryProps {
  visibleItems: CartItem[];
  totalMaxPrice: number;
  totalDiscount: number;
  finalPrice: number;
  totalBonuses: number;
  isMinimumPriceReached: boolean;
}

export interface CartSidebarProps extends CartSummaryProps, CartBonusesSectionProps {}