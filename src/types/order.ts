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

type OrderPaymentMethod = "cash_on_delivery" | "online";

export interface Order {
  deliveryAddress: DeliveryAddress;
  deliveryTime: DeliveryTime;
  cartItems: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  totalBonuses: number;
  maxBonusAmountToUse: number;
  paymentMethod: OrderPaymentMethod;
}
