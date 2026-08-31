import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { ApiResponse } from "@/types/api/default-response";
import { ObjectId } from "mongodb";
import { Category } from "../../../../../../../../types/entities";

type ReorderData = Pick<Category, "_id" | "numericId">;

export const PUT = async (
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> => {
  try {
    const reorderData: ReorderData = await request.json();
    if (!Array.isArray(reorderData)) {
      return NextResponse.json(
        { success: false, message: "Неверный формат данных" },
        { status: 400 },
      );
    }

    for (const item of reorderData) {
      if (!item._id || typeof item.numericId !== "number") {
        return NextResponse.json(
          { success: false, message: "Неверные данные о категории" },
          { status: 400 },
        );
      }
    }

    const db = await getDB();
    const bulkOperations = reorderData.map((item) => ({
      updateOne: {
        filter: { _id: new ObjectId(item._id) },
        update: {
          $set: {
            numericId: item.numericId,
            updatedAt: new Date().toISOString(),
          },
        },
      },
    }));

    if (bulkOperations.length > 0) {
      await db.collection("article-category").bulkWrite(bulkOperations);
      return NextResponse.json(
        { success: true, message: "Порядок категорий обновлен" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Нет данных об обновлении" },
      { status: 400 },
    );
  } catch (e) {
    console.error("Ошибка при обновлении порядка категории: ", e);
    return NextResponse.json(
      { success: false, message: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
