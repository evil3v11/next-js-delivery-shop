import { getDB } from "@/utils/api-routes";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Введите минимум 3 символа для поиска",
          data: {
            articles: null,
          },
        },
        { status: 400 },
      );
    }

    const db = await getDB();

    const searchResult = await db
      .collection("articles")
      .find({
        $and: [
          { status: { $in: ["published", "archived"] } },
          {
            $or: [
              { name: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
              { content: { $regex: query, $options: "i" } },
            ],
          },
        ],
      })
      .project({
        _id: 1,
        slug: 1,
        name: 1,
        description: 1,
        image: 1,
        imageAlt: 1,
        publishedAt: 1,
        categoryId: 1,
        categorySlug: 1,
        categoryName: 1,
      })
      .sort({ publishedAt: -1 })
      .limit(20)
      .toArray();

    if (!searchResult.length) {
      return NextResponse.json(
        {
          success: false,
          message: `Не найдены статьи по запросу ${query}`,
          data: {
            articles: null,
          },
        },
        { status: 200 },
      );
    }

    const articles = searchResult.map((a) => ({
      ...a,
      _id: String(a._id),
      category: a.categorySlug
        ? {
            _id: String(a.categoryId),
            slug: a.categorySlug,
            name: a.categoryName,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      message: "Статьи успешно найдены",
      count: articles.length,
      query,
      data: {
        articles: articles,
      },
    });
  } catch (e) {
    console.error("Ошибка при поиске статей: ", e);
    return NextResponse.json(
      {
        success: false,
        message: `Произошла внутренняя ошибка при поиске статей`,
        data: {
          articles: null,
        },
      },
      { status: 500 },
    );
  }
};
