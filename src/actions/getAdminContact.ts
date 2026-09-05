"use server";

import { getDB } from "@/utils/api-routes";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

export const getAdminContact = async () => {
  try {
    const db = await getDB();

    const admin = await db.collection("user").findOne(
      { role: "admin" },
      {
        projection: {
          email: 1,
          phoneNumber: 1,
        },
      },
    );

    if (!admin) {
      return {
        email: "admin@example.com",
        phoneNumber: "8-(800)-555-35-35",
      };
    }

    const formattedPhone = formatPhoneNumber(admin.phoneNumber ?? "");
    return {
      email: admin.email,
      phoneNumber: formattedPhone,
    };
  } catch (e) {
    console.log("Не удалось получить данные о администраторе: ", e);
    return {
      email: "admin@example.com",
      phoneNumber: "8-(800)-555-35-35",
    };
  }
};
