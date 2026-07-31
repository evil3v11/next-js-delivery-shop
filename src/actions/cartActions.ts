"use server"

import { CartItem } from "@/types/cart";
import { UserData } from "@/types/userData";

import { getDB } from "@/utils/api-routes";
import { getServerUserId } from "@/utils/getServerUserId";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export const getCartAction = async (): Promise<CartItem[]> => {
  try {
    const userId = await getServerUserId();
    if (!userId) return [];

    const db = await getDB();
    const user = await db.collection<UserData>("user").findOne({ _id: new ObjectId(userId) });
    return user ? user.cart : [];
  } catch {
    return [];
  }
};

export const getUserBonusesAction = async (): Promise<{ bonusesAmount: number; hasLoyaltyCard: boolean; }> => {
  try {
    const userId = await getServerUserId();
    if (!userId) return { bonusesAmount: 0, hasLoyaltyCard: false };

    const db = await getDB();
    const user = await db.collection<UserData>("user").findOne({ _id: new ObjectId(userId) });

    const bonusesAmount = user?.bonusesAmount || 0
    const hasLoyaltyCard = !!(user?.card && user.card.trim() !== "")
    return { bonusesAmount, hasLoyaltyCard }
  } catch {
    return {
      bonusesAmount: 0,
      hasLoyaltyCard: false,
    };
  }
};

export const updateItemQuantityAction = async (productId: string, newQuantity: number): Promise<{ success: boolean; message: string }> => {
  try {
    if (!productId || !newQuantity) return { success: false, message: "Нет данных для обновления количества" };

    const userId = await getServerUserId();
    if (!userId) return { success: false, message: "Пользователь не авторизован" };

    const db = await getDB();
    const user = await db.collection<UserData>("user").findOne({ _id: new ObjectId(userId) });
    if (!user) return { success: false, message: "Такого пользователя не существует" };

    const updateResult = await db.collection("user").updateOne(
      { _id: new ObjectId(userId), "cart.productId": productId },
      { $set: { "cart.$.quantity": newQuantity } },
    );

    if (!updateResult.modifiedCount) return { success: false, message: "Такого товара не существует" };
    
    revalidatePath("/cart")
    return { success: true, message: "Количество успешно обновлено" }
  } catch (e) {
    console.error("Ошибка при обновлении количества товаров в корзине: ", e)
    return { success: false, message: "Ошибка при обновлении количества товаров в корзине" }
  }
};

export const removeMultipleItemsAction = async (productIds: string[]): Promise<{ success: boolean; message: string }> => {
  try {
    if (!productIds.length) return { success: false, message: "Нет ID продуктов для удаления" };

    const userId = await getServerUserId();
    if (!userId) return { success: false, message: "Пользователь не авторизован" };

    const db = await getDB();
    const user = await db.collection<UserData>("user").findOne({ _id: new ObjectId(userId) });
    if (!user) return { success: false, message: "Такого пользователя не существует" };

    const updatedCart = user.cart.filter((item) => !productIds.includes(item.productId))

    const deleteResult = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart: updatedCart } }
    );

    if (!deleteResult.modifiedCount) return { success: false, message: "Таких товаров не существует" };
    
    revalidatePath("/cart")
    return { success: true, message: "Товары успешно удалены из корзины" }
  } catch (e) {
    console.error("Ошибка при удалении товаров из корзины: ", e)
    return { success: false, message: "Ошибка при удалении товаров из корзины" }
  }
};
