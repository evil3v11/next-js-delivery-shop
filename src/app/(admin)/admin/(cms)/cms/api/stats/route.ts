import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { ApiResponse } from "@/types/api/default-response";

export const GET = async (
  _request: NextRequest,
): Promise<
  NextResponse<ApiResponse & { publishedCount?: number; totalViews?: number }>
> => {
  try {
    const db = await getDB();

    const publishedCount = await db
      .collection("articles")
      .countDocuments({ status: { $in: ["published", "archived"] } });

    const articles = await db
      .collection("articles")
      .find({}, { projection: { views: 1 } })
      .toArray();

    let totalViews = 0;
    for (const article of articles) {
      totalViews += article.views;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Запрос успешно обработан",
        publishedCount,
        totalViews,
      },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при получении статистики: ", e);
    return NextResponse.json(
      {
        success: true,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 },
    );
  }
};
