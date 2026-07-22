import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) => {
  try {
    const { role } = await request.json();
    const { userId } = await params;

    if (!role || !userId) {
      return NextResponse.json(
        { error: `Необходимы userId и обновляемая роль` },
        { status: 400 },
      );
    }

    const db = await getDB();
    let userObjectId;

    try {
      userObjectId = new ObjectId(userId);
    } catch {
      return NextResponse.json(
        { error: "Неправильный userId" },
        { status: 400 },
      );
    }

    const updateResult = await db
      .collection("user")
      .updateOne(
        { _id: userObjectId },
        { $set: { role, updatedAt: new Date() } },
      );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Такого пользователя не существует" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Роль успешно обновлена",
    });
  } catch (e) {
    console.error("Ошибка обновления роли");
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
