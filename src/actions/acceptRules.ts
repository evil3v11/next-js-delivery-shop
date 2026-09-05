"use server";

import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";

export const acceptRules = async (userId: string) => {
  try {
    const db = await getDB();
    await db
      .collection("user")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { rulesAcceptedAt: new Date() } },
      );

    return { success: true, message: "Правила приняты успешно" };
  } catch (e) {
    console.log(`Ошибка при сохранения ознакомления с правилами: ${e}`);
    return {
      success: false,
      message: `Ошибка при сохранения ознакомления с правилами: ${e}`,
    };
  }
};

export const checkRulesAcceptence = async (userId: string) => {
  try {
    const db = await getDB();
    const user = await db
      .collection("user")
      .findOne(
        { _id: new ObjectId(userId) },
        { projection: { rulesAcceptedAt: 1 } },
      );

    return !!user?.hasAccepted;
  } catch (e) {
    console.log(`Ошибка при проверке ознакомления с правилами: ${e}`);
    return false;
  }
};
