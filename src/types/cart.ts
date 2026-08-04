import { DeliveryAddress, DeliveryTime } from "./order";
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
  deliveryData: {
    address: DeliveryAddress;
    time: DeliveryTime;
    isValid: boolean;
  } | null;
  productsData: Record<string, ProductCardProps>;
}

export interface CalculatedItem {
  basePrice: number;
  discountedPrice: number;
  finalPrice: number;
  discountAmount: number;
  bonuses: number;
  quantity: number;
}
