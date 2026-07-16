import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { userId, card } = await request.json();
    const db = await getDB();
    let objectId: ObjectId;

    if (!userId || !card) {
      return NextResponse.json(
        { error: "Нужен userId и номер карты" },
        { status: 400 },
      );
    }

    try {
      objectId = new ObjectId(userId);
    } catch {
      return NextResponse.json(
        { error: "Неправильный userId" },
        { status: 400 },
      );
    }

    const cardExists = await db.collection("user").findOne({ card });

    if (cardExists) {
      return NextResponse.json(
        { error: "Данная карта уже зарегестрирована в системе" },
        { status: 409 },
      );
    }

    const updateResult = await db
      .collection("user")
      .updateOne(
        { _id: objectId },
        { $set: { card, hasCard: true, updatedAt: new Date() } },
      );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Такого пользователя не существует" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Номер карты успешно обновлен",
    });
  } catch (e) {
    console.error("Ошибка при обновлении карты: ", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
