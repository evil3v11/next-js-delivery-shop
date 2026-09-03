import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import type { ApiResponse } from "@/types/api/default-response";

export const PATCH = async (
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> => {
  try {
    const { id, status } = await request.json();
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Неправильные данные о статье" },
        { status: 400 },
      );
    }

    if (!["published", "draft", "archived", "deleted"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Неверный статус статьи" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const updateResult = await db
      .collection("articles")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } },
      );

    if (!updateResult.modifiedCount) {
      return NextResponse.json(
        { success: false, message: "Такая статья не существует" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Статус статьи успешно обновлен" },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при обновлении статуса статьи: ", e);
    return NextResponse.json(
      { success: false, message: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
