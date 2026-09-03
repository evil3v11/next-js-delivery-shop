import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { ApiResponse } from "@/types/api/default-response";
import { ObjectId } from "mongodb";

export const PUT = async (
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> => {
  try {
    const { items, itemType } = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Неверный формат данных" },
        { status: 400 },
      );
    }

    for (const item of items) {
      if (!item._id || typeof item.numericId !== "number") {
        return NextResponse.json(
          { success: false, message: "Неверные данные о итеме" },
          { status: 400 },
        );
      }
    }

    const db = await getDB();
    const bulkOperations = items.map((item) => ({
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

    const collectionToUpdate = itemType === 'categories' ? 'article-category' : 'articles'

    if (bulkOperations.length > 0) {
      await db.collection(collectionToUpdate).bulkWrite(bulkOperations);
      return NextResponse.json(
        { success: true, message: "Порядок итемов обновлен" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Нет данных об обновлении" },
      { status: 400 },
    );
  } catch (e) {
    console.error("Ошибка при обновлении порядка итемов: ", e);
    return NextResponse.json(
      { success: false, message: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
