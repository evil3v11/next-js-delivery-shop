import { CONFIG } from "../../../../../config/config";
import {
  calculateFinalPrice,
  calculatePriceByCard,
} from "@/utils/calculateProductPrice";

import { CartItem } from "@/types/cart";
import {
  CartItemWithPrice,
  CreateOrderRequest,
  CreateOrderSuccess,
  Order,
  ProductsData,
  UpdateUserData,
} from "@/types/order";
import { UpdateUserDataAfterPaymentResponse } from "@/types/api/update-user-after-payment";
import { ApiResponse } from "@/types/api/default-response";
import { ObjectId } from "mongodb";

export const prepareCartItemsWithPrices = (
  cartItems: CartItem[],
  productsData: ProductsData,
  hasLoyaltyCard: boolean,
): CartItemWithPrice[] => {
  return cartItems
    .map(({ productId, quantity, ...item }) => {
      const { basePrice, discountPercent } = productsData[productId];

      if (!productsData[productId]) return null;

      const discountedPrice = calculateFinalPrice(
        basePrice,
        discountPercent || 0,
      );
      const finalPrice = hasLoyaltyCard
        ? calculatePriceByCard(discountedPrice, CONFIG.CARD_DISCOUNT_PERCENT)
        : discountedPrice;

      return {
        ...item,
        productId,
        quantity,
        price: finalPrice,
        basePrice,
        discountPercent: discountPercent || 0,
        hasLoyaltyDiscount: hasLoyaltyCard,
      };
    })
    .filter(Boolean) as CartItemWithPrice[];
};

export const createOrderRequest = async (
  orderData: CreateOrderRequest,
): Promise<CreateOrderSuccess> => {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok)
      throw new Error(
        (await response.json()).message || "Ошибка при создании заказа",
      );

    return await response.json();
  } catch (e) {
    console.error("Ошибка при создании заказа: ", e);
    throw e;
  }
};

export const updateUserAfterPayment = async (
  data: Partial<UpdateUserData> & { orderId: ObjectId },
): Promise<UpdateUserDataAfterPaymentResponse> => {
  try {
    const response = await fetch("/api/orders/update-user-after-payment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok)
      throw new Error(
        (await response.json()).message || "Ошибка при обновлении пользователя",
      );

    return await response.json();
  } catch (e) {
    console.error("Ошибка обновления пользователя после оплаты заказа: ", e);
    throw e;
  }
};

export const clearUserCart = async (): Promise<void> => {
  try {
    const response = await fetch("/api/orders/clear-cart", { method: "POST" });
    if (!response.ok) throw new Error("Произшла ошибка при очистке корзины");
    const { success, message } = await response.json();
    if (!success) throw new Error(message || "Неизвестная ошибка");
  } catch (e) {
    console.error("Ошибка очистки корзины: ", e);
  }
};

export const updateOrderStatus = async (
  orderId: string,
  updates: Partial<Pick<Order, "status" | "paymentStatus">>,
): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/orders/update-status', {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orderId, ...updates })
    })

    if (!response.ok) throw new Error("Ошибка при обновлении статуса заказа")

    const result: ApiResponse = await response.json()
    return result
  } catch (e) {
    console.error("Ошибка обновления статуса заказа: ", e);
    throw e
  }
};

export const markPaymentAsFailed = async (orderId: string): Promise<ApiResponse> => 
  await updateOrderStatus(orderId, { status: 'pending', paymentStatus: "failed" })
