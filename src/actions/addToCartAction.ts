"use server";

import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";

import { UserData } from "@/types/userData";
import { CartItem } from "@/types/cart";

import { getServerUserId } from "@/utils/getServerUserId";

type AddToCartResponse = {
  success: boolean;
  message: string;
  loyaltyPrice?: number;
};

export const addToCartAction = async (productId: string): Promise<AddToCartResponse> => {
  try {
    if (!productId) return { success: false, message: "Нет ID продукта" };

    const userId = await getServerUserId();
    if (!userId) return { success: false, message: "Пользователь не авторизован" };

    const db = await getDB();

    const user = await db.collection<UserData>("user").findOne({ _id: new ObjectId(userId) });
    if (!user) return { success: false, message: "Такого пользователя не существует" };

    const product = await db.collection("products").findOne({ id: Number(productId) });
    if (!product) return { success: false, message: "Такого товара не существует" };

    const itemsInCart: CartItem[] = user.cart || [];
    const existingItemInCart = itemsInCart.find((i) => i.productId === productId);
    if (existingItemInCart) {
      return {
        success: false,
        message: "",
      };
    }

    const initialQuantity = product.quantity > 0 ? 1 : 0
    const newCartItem: CartItem = {
      productId,
      quantity: initialQuantity,
      addedAt: new Date(),
    };

    const newCartItems = [...itemsInCart, newCartItem];

    await db.collection("user").updateOne({ _id: new ObjectId(userId) }, { $set: { cart: newCartItems } });

    return {
      success: true,
      message: '',
    };;
  } catch (e) {
    console.error("Ошибка при добавлении товара в корзину: ", e);
    return {
      success: false,
      message: "Ошибка при добавлении товара в корзину",
    };
  }
};
