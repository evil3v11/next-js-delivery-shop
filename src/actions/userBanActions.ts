"use server";

import { getDB } from "@/utils/api-routes";
import { formatLocaleDate } from "@/utils/formatLocaleDate";
import { ObjectId } from "mongodb";

export const checkBan = async (userId: string) => {
  try {
    if (!userId) {
      return {
        isBanned: false,
        bannedUntil: undefined,
      };
    }

    const db = await getDB();
    const result = await db.collection("user").findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          isBanned: 1,
          bannedUntil: 1,
        },
      },
    );

    if (!result) {
      return {
        isBanned: false,
        bannedUntil: undefined,
      };
    }

    return {
      isBanned: result.isBanned,
      bannedUntil: result.bannedUntil,
    };
  } catch (e) {
    console.error(`Ошибка при разбане пользователя: ${e}`);
    return {
      isBanned: false,
      bannedUntil: undefined,
    };
  }
};

export const banUser = async (userId: string, banDays: number | null) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "ID пользователя не указан",
      };
    }

    const db = await getDB();

    let banUntil = null;
    if (banDays !== null) {
      banUntil = new Date();
      banUntil.setDate(banUntil.getDate() + banDays);
    }

    const banResult = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          isBanned: true,
          bannedUntil: banUntil,
          bannedAt: new Date(),
        },
      },
    );

    if (!banResult.modifiedCount) {
      return {
        success: false,
        message: "Такого пользователя не существует",
      };
    }

    const bannedUntil = String(banUntil);

    return {
      success: true,
      message:
        banDays === null
          ? "Пользователь успешно забанен навсегда"
          : `Пользователь успешно забанен до ${formatLocaleDate(bannedUntil)}`,
      bannedUntil,
    };
  } catch (e) {
    console.error(`Ошибка при бане пользователя: ${e}`);
    return {
      success: false,
      message: `Ошибка при бане пользователя: ${e}`,
    };
  }
};

export const unbanUser = async (userId: string) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "ID пользователя не указан",
      };
    }

    const db = await getDB();
    const unbanResult = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          isBanned: false,
          bannedUntil: "",
          bannedAt: "",
        },
      },
    );

    if (!unbanResult.modifiedCount) {
      return {
        success: false,
        message: "Такого пользователя не существует",
      };
    }

    return {
      success: true,
      message: "Пользователь успешно разбанен",
    };
  } catch (e) {
    console.error(`Ошибка при разбане пользователя: ${e}`);
    return {
      success: false,
      message: `Ошибка при разбане пользователя: ${e}`,
    };
  }
};
