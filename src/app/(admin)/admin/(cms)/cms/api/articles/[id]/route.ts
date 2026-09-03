import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Article, FetchArticleResponse } from "../../../_types";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<FetchArticleResponse>> => {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Неверные данные о статье",
        },
        { status: 400 },
      );
    }

    const db = await getDB();
    const article = await db.collection('articles').findOne<Article>({ _id: new ObjectId(id) })

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Такая статья не существует",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Запрос успешно обработан",
        data: article,
      },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при получении статьи: ", e);
    return NextResponse.json(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 },
    );
  }
};
