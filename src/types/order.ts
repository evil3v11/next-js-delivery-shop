import { ObjectId } from "mongodb";
import { CartItem } from "./cart";

export interface DeliveryAddress {
  city: string;
  street: string;
  house: string;
  apartment: string;
  additional: string;
}

export interface DeliveryTime {
  date: string;
  timeSlot: string;
}

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
export type PaymentStatus = "pending" | "waiting" | "paid";
export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface Order {
  paymentMethod: OrderPaymentMethod;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

export interface OrderInCreation {
  userId: ObjectId;
  orderNumber: string;
  status: string;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  discountAmount: number;
  bonusesUsed: number;
  bonusesEarned: number;
  deliveryAddress: DeliveryAddress;
  deliveryTime: string;
  lastName: string;
  name: string;
  phone: string;
  gender: string;
  birthday: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

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
  order: OrderInCreation & { _id: ObjectId };
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

interface UpdateUserDataAfterPaymentSuccess {
  message: string;
  success?: boolean;
  updatedFields?: {
    bonusesDeducted: number;
    bonusesAdded: number;
    newBonusesAmount: number;
    productsAdded: number;
    cartCleared: boolean;
  };
}

interface UpdateUserDataAfterPaymentError {
  message: string;
  availableBonuses?: number;
  requiredBonuses?: number;
}

export interface UpdateUserDataAfterPaymentResponse
  extends UpdateUserDataAfterPaymentSuccess, UpdateUserDataAfterPaymentError {}
