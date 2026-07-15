import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { userId, email } = await request.json();
    const db = await getDB();
    let objectId: ObjectId;

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Необходимо userId и email" },
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

    const alreadyExistingEmail = await db.collection("user").findOne({
      email,
      _id: { $ne: objectId },
    });

    if (alreadyExistingEmail) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 },
      );
    }

    const updateResult = await db.collection("user").updateOne(
      { _id: objectId },
      {
        $set: {
          email: email,
          updatedAt: new Date(),
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      const user = await db.collection("user").findOne({ _id: objectId });

      if (user && user.email === email) {
        return NextResponse.json(
          { error: "Email для этого пользователя уже установлен" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email успешно обновлен",
    });
  } catch (e) {
    console.error("Ошибка при обновлении email: ", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
