import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { userId, region, location } = await request.json();
    const db = await getDB();

    if (!userId)
      return NextResponse.json(
        { error: "Необходим userId для обновления" },
        { status: 400 },
      );

    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          region,
          location,
          updatedAt: new Date(),
        },
      },
    );

    if (result.modifiedCount === 0)
      return NextResponse.json(
        { error: "Такого пользователя не существует" },
        { status: 404 },
      );

    return NextResponse.json(
      { success: true, message: "Данные о местоположении успешно изменены" },
      { status: 200 },
    );
  } catch {
    console.error("Внутренняя ошибка сервера");
  }
};
