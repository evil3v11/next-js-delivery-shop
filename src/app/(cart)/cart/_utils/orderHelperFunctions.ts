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
  UpdateUserData,
  UpdateUserDataAfterPaymentResponse,
} from "@/types/order";
import { ProductCardProps } from "@/types/product";
import { ObjectId } from "mongodb";
import { ConfirmPaymentResponse } from "@/types/api/confirm-payment";

export const prepareCartItemsWithPrices = (
  cartItems: CartItem[],
  productsData: Record<string, ProductCardProps>,
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
    console.log(orderData)
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error((await response.json()).message || "Ошибка при создании заказа");

    return await response.json();
  } catch (e) {
    console.error("Ошибка при создании заказа: ", e);
    throw e;
  }
};

export const confirmOrderPayment = async (orderId: ObjectId): Promise<ConfirmPaymentResponse> => {
  try {
    const response = await fetch("/api/orders/confirm-payment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orderId })
    })

    if (!response.ok) throw new Error((await response.json()).message || "Ошибка при проверки оплаты заказа");

    return await response.json()
  } catch (e) {
    console.error("Ошибка обновления пользователя после оплаты заказа: ", e);
    throw e;
  }
}

export const updateUserAfterPayment = async (
  data: UpdateUserData,
): Promise<UpdateUserDataAfterPaymentResponse> => {
  try {
    const response = await fetch("/api/users/update-after-payment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error((await response.json()).message || "Ошибка при обновлении пользователя");

    return await response.json();
  } catch (e) {
    console.error("Ошибка обновления пользователя после оплаты заказа: ", e);
    throw e;
  }
};
