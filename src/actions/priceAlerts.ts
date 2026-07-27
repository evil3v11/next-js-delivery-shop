"use server";

import { getDB } from "@/utils/api-routes";
import { randomBytes } from "crypto";

export interface PriceAlertFormState {
  errors?: {
    email?: string;
    general?: string;
  };
  success?: boolean;
  unsubscribeToken?: string;
}

export const createPriceAlert = async (
  _prevState: PriceAlertFormState | null,
  formData: FormData,
): Promise<PriceAlertFormState> => {
  try {
    const db = await getDB();

    const productId = formData.get("productId") as string;
    const productTitle = formData.get("productTitle") as string;
    const currentPrice = Number(formData.get("currentPrice"));
    const email = formData.get("email") as string;

    if (!email.trim()) return { errors: { email: "Email обязателен" } };

    const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegExp.test(email)) return { errors: { email: "Введите корректный email" } };

    const existingAlert = await db
      .collection("priceAlerts")
      .findOne({ productId, email });

    if (existingAlert) return { errors: { email: "Вы уже подписаны на уведомление для этого товара" } };

    const unsubscribeToken = randomBytes(32).toString("hex");
    await db.collection("priceAlerts").insertOne({
      email,
      productId,
      productTitle,
      currentPrice,
      unsubscribeToken,
      createdAt: new Date(),
    });

    return { success: true, unsubscribeToken };
  } catch (e) {
    console.error("Ошибка создания подписки на товар: ", e);
    return { errors: { general: "Ошибка оформления подписки" } };
  }
};

export const unsubscribeFromPriceAlert = async (
  token: string,
): Promise<{ success?: boolean; error?: string }> => {
  try {
    const db = await getDB();

    const existingAlert = await db
      .collection("priceAlerts")
      .findOne({ unsubscribeToken: token });

    if (!existingAlert) return { error: "Вы не подписаны на данный товар" };

    const deleteResult = await db
      .collection("priceAlerts")
      .deleteOne({ unsubscribeToken: token });
      
    if (deleteResult.deletedCount === 0) return { error: "Такой подписки не существует" };

    return { success: true };
  } catch (e) {
    console.error("Ошибка отписки от товара: ", e);
    return { error: "Ошибка отмены подписки" };
  }
};
