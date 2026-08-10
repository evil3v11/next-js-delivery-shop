import { DeliveryData, ProductsData } from "./order";
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
}

export interface CartSidebarProps {
  deliveryData: DeliveryData | null;
  productsData: ProductsData;
}

export interface CartSummaryProps extends CartSidebarProps {
  isReorder?: boolean;
  customCartItems?: CustomCartItem[];
  customPricing?: CustomPricing;
  onOrderSuccess?: () => void;
}

export interface CalculatedItem {
  basePrice: number;
  discountedPrice: number;
  finalPrice: number;
  discountAmount: number;
  bonuses: number;
  quantity: number;
}

export interface CustomCartItem {
  productId: string;
  quantity: number;
  price: number;
  discountPercent: number;
  hasLoyaltyDiscount: boolean;
  addedAt: Date;
}

export interface CustomPricing {
  totalPrice: number;
  totalMaxPrice: number;
  totalDiscount: number;
  finalPrice: number;
  totalBonuses: number;
  maxBonusAmount: number;
  isMinimumReached: boolean;
}
