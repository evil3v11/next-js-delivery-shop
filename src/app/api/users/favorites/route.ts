import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ favorites: [] }, { status: 400 });

    const db = await getDB();
    const user = await db
      .collection("user")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) return NextResponse.json({ favorites: [] }, { status: 404 });

    return NextResponse.json({ favorites: user.favorites }, { status: 200 });
  } catch (e) {
    console.error("Ошибка при запросе избранных товаров: ", e);
    return NextResponse.json({ favorites: [] }, { status: 500 });
  }
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { productId, userId, action } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Нет ID пользователя и продукт" },
        { status: 400 },
      );
    }

    const db = await getDB();

    if (action === "add") {
      const insertResult = await db.collection("user").updateOne(
        { _id: new ObjectId(userId) },
        {
          $addToSet: { favorites: productId },
          $set: { updatedAt: new Date() },
        },
      );

      if (!insertResult.modifiedCount) {
        return NextResponse.json(
          { error: "Такого пользователя не существует" },
          { status: 404 },
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (action === "remove") {
      const deleteResult = await db
        .collection("user")
        .updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { favorites: productId }, $set: { updatedAt: new Date() } },
        );

      if (!deleteResult.modifiedCount) {
        return NextResponse.json(
          { error: "Такого пользователя не существует" },
          { status: 404 },
        );
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Отсутствует действие" },
      { status: 400 },
    );
  } catch (e) {
    console.error("Ошибка при добавлении/удалении товара из Избранных: ", e);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
