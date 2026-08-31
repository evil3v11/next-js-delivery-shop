import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import type {
  Article,
  ArticleData,
  ArticlePageData,
  Category,
} from "@/types/entities";

export const GET = async (
  _request: NextRequest,
  {
    params,
  }: { params: Promise<{ categorySlug: string; articleSlug: string }> },
): Promise<NextResponse<ArticlePageData | { error: string }>> => {
  try {
    const { categorySlug, articleSlug } = await params;
    const db = await getDB();

    const categoryDocument = await db
      .collection<Category>("article-category")
      .findOne({ slug: categorySlug });

    if (!categoryDocument) {
      return NextResponse.json(
        { error: "Такой категории не существует" },
        { status: 404 },
      );
    }

    const articleDocument = await db.collection<Article>("articles").findOne({
      categoryId: String(categoryDocument._id),
      slug: articleSlug,
      status: "published",
    });

    if (!articleDocument) {
      return NextResponse.json(
        { error: "Такой статьи не существует" },
        { status: 404 },
      );
    }

    const articleAfterIncrement = await db
      .collection<ArticleData>("articles")
      .findOneAndUpdate(
        { _id: articleDocument._id },
        { $inc: { views: 1 } },
        {
          returnDocument: "after",
          projection: {
            _id: 1,
            slug: 1,
            name: 1,
            keywords: 1,
            image: 1,
            imageAlt: 1,
            description: 1,
            content: 1,
            publishedAt: 1,
            author: 1,
            views: 1,
          },
        },
      );

    if (!articleAfterIncrement) {
      return NextResponse.json(
        { error: "Не удалось обновить счетчик просмотров" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        article: {
          ...articleAfterIncrement,
          _id: String(articleAfterIncrement._id),
        },
        category: { ...categoryDocument, _id: String(categoryDocument._id) },
      },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при запросе данных о статье: ", e);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
