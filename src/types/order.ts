import type { ObjectId } from "mongodb";
import { ProductCardProps } from "./product";
import { CustomCartItem, CustomPricing } from "./cart";

export type DeliveryAddress = {
  city: string;
  street: string;
  house: string;
  apartment: string;
  additional: string;
};

export type DeliveryTime = {
  date: string;
  timeSlot: string;
};

export type DeliveryData = {
  address: DeliveryAddress;
  time: DeliveryTime;
};

export type AvailableDate = {
  date: Date;
  dateString: string;
  availableSlots: number;
};

export interface CartItemWithPrice {
  productId: string;
  quantity: number;
  price: number;
  basePrice?: number;
  discountPercent?: number;
  hasLoyaltyDiscount?: boolean;
}

export type OrderPaymentMethod = "cash" | "online";
export type PaymentMethodOrNull = OrderPaymentMethod | null;
export type PaymentStatus = "pending" | "waiting" | "paid" | "failed";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "delivered"
  | "cancelled"
  | "failed"
  | "collected"
  | "delivering"
  | "refund"
  | "returned";

export type OrderStatusRu =
  | "Подтвержден"
  | "Не подтвердили"
  | "Новый"
  | "Доставляется"
  | "Возврат"
  | "Собран"
  | "Вернули";

export type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
  discountPercent?: number;
  hasLoyaltyDiscount?: boolean;
  name: string;
  totalPrice: number;
  // basePrice: number;
  // title: string;
  // productDetails?: {
  //   _id: string;
  //   id: number;
  //   img: string;
  //   title: string;
  //   description: string;
  //   basePrice: number;
  //   discountPercent: number;
  // };
};

export type Order = {
  _id: ObjectId;
  userId: ObjectId;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  discountAmount: number;
  bonusesUsed: number;
  bonusesEarned: number;
  deliveryAddress: DeliveryAddress;
  deliveryTime: DeliveryTime;
  lastName: string;
  name: string;
  phone: string;
  gender: string;
  birthday: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
};

export type OrderStats = {
  amountOfNextThreeDaysOfOrders: number;
};

export interface CreateOrderRequest {
  finalPrice: number;
  totalBonuses: number;
  maxBonusAmountToUse: number;
  totalDiscount: number;
  deliveryAddress: DeliveryAddress;
  deliveryTime: DeliveryTime;
  cartItems: CartItemWithPrice[];
  totalPrice: number;
  paymentMethod: OrderPaymentMethod;
  paymentId?: string;
}

export interface CreateOrderSuccess {
  success: boolean;
  order: Order;
  orderNumber: string;
}

export interface CreateOrderError {
  error: string;
}

export type UpdateUserData = {
  usedBonuses: number;
  earnedBonuses: number;
  purchasedProductIds: string[];
};

export type ProductsData = Record<
  string,
  Pick<ProductCardProps, "basePrice" | "discountPercent" | "hasLoyaltyDiscount">
>;

export type CurrentProduct = {
  id: string;
  title: string;
  price: number;
  basePrice: number;
  discountPercent?: number;
  hasLoyaltyDiscount?: boolean;
};

export type PriceComparison = {
  hasChanges: boolean;
  originalTotal: number;
  currentTotal: number;
  difference: number;
  changedItems: {
    productId: string;
    productName: string;
    originalPrice: number;
    currentPrice: number;
    quantity: number;
    didPriceChanged: boolean;
    didDiscountChanged: boolean;
    didLoyaltyStatusChanged: boolean;
    originalDiscount: number;
    currentDiscount: number;
    originalHasLoyalty: boolean;
    currentHasLoyalty: boolean;
  }[];
};

export type RepeatOrderSectionProps = {
  isRepeatOrderCreated: boolean;
  selectedDelivery: DeliveryData | null;
  canReorder: boolean;
  order: Order;
  priceComparison: PriceComparison | null;
  showPriceWarning: boolean;
  onClosePriceWarning: () => void;
  deliveryData: DeliveryData | null;
  onEditDelivery: () => void;
  productsData: ProductsData;
  cartItemsForSummary: CustomCartItem[];
  customPricing: CustomPricing;
  onOrderSuccess: () => void;
};
