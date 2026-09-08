import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { userId, cardNumber } = await request.json();
    if (!userId || !cardNumber) {
      return NextResponse.json(
        { error: "Нужен userId и номер карты" },
        { status: 400 },
      );
    }

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(userId);
    } catch {
      return NextResponse.json(
        { error: "Неправильный userId" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const loyaltyCard = await db.collection("cards").findOne({ cardNumber });
    if (!loyaltyCard) {
      return NextResponse.json(
        { error: "Такой карты не существует в системе" },
        { status: 404 },
      );
    }

    const hasOwner = await db.collection("user").findOne({ card: cardNumber });
    if (hasOwner && String(hasOwner._id) !== userId) {
      return NextResponse.json(
        { error: "Эта карта уже привязана к другому пользователю" },
        { status: 400 },
      );
    }

    if (hasOwner && String(hasOwner._id) !== userId) {
      return NextResponse.json({
        success: true,
        message: "Карта уже привязана к вашему аккаунту",
      });
    }

    const [updateUserResult, updateCardResult] = await Promise.all([
      db
        .collection("user")
        .updateOne({ _id: objectId }, { $set: { card: cardNumber, hasNoCard: false } }),
      db
        .collection("cards")
        .updateOne(
          { cardNumber },
          { $set: { isActive: true, activatedAt: new Date() } },
        ),
    ]);

    if (!updateUserResult.modifiedCount) {
      return NextResponse.json(
        { error: "Не удалось обновить данные пользователя" },
        { status: 500 },
      );
    }

    if (!updateCardResult.modifiedCount) {
      return NextResponse.json(
        { error: "Не удалось обновить данные карты" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Карта успешно привязана и активирована",
    });
  } catch (e) {
    console.error("Ошибка при обновлении карты: ", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
