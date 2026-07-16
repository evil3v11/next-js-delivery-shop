import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { userId, phoneNumber } = await request.json();
    const db = await getDB();
    let objectId: ObjectId;

    if (!userId || !phoneNumber) {
      return NextResponse.json(
        { error: "Необходимо userId и номер телефона" },
        { status: 400 },
      );
    }

    try {
      objectId = new ObjectId(userId);
    } catch {
      return NextResponse.json(
        { error: "Неправильный ID пользователя" },
        { status: 400 },
      );
    }

    const existingPhone = await db.collection("user").findOne({
      phoneNumber,
      _id: { $ne: objectId },
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: "Такой номер уже существует" },
        { status: 409 },
      );
    }

    const updateResult = await db.collection("user").updateOne(
      { _id: objectId },
      {
        $set: {
          phoneNumber,
          updatedAt: new Date(),
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      const user = await db.collection("user").findOne({ _id: objectId });

      if (user && user.phoneNumber === phoneNumber) {
        return NextResponse.json(
          { error: "Номер телефона для этого пользователя уже установлен" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { success: true, message: "Номер телефона успешно обновлен" },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при обновлении номера телефона: ", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
