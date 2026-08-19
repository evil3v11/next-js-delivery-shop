import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import type { CreateArticleResponse } from "../../_types";

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<CreateArticleResponse>> => {
  try {
    const data = await request.json();

    if (!data.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Нет названия статьи" },
        { status: 400 },
      );
    }

    if (!data.slug?.trim()) {
      return NextResponse.json(
        { success: false, message: "Нет slug'а статьи" },
        { status: 400 },
      );
    }

    if (!data.author?.trim()) {
      return NextResponse.json(
        { success: false, message: "Нет автора статьи" },
        { status: 400 },
      );
    }

    if (!data.categoryId?.trim()) {
      return NextResponse.json(
        { success: false, message: "Нет категории статьи" },
        { status: 400 },
      );
    }

    const name = data.name.trim();
    const slug = data.slug.trim().toLowerCase();
    const description = data.description?.trim() || "";
    const keywords = Array.isArray(data.keywords)
      ? data.keywords
      : (data.keywords || "")
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean);
    const image = data.image || "";
    const imageAlt = data.imageAlt || name;
    const author = data.author.trim();
    const categoryId = data.categoryId.trim();
    const categoryName = data.categoryName?.trim() || "";
    const categorySlug = data.categorySlug?.trim() || "";
    const content = data.content || "";
    const isFeatured = data.isFeatured || false;
    const status = data.status || "draft";

    const db = await getDB();
    const existingCategory = await db.collection("articles").findOne({ slug });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Такой slug статьи уже существует" },
        { status: 400 },
      );
    }

    if (categoryId) {
      const categoryExists = await db
        .collection("article-category")
        .findOne({ _id: new ObjectId(categoryId) });

      if (!categoryExists) {
        return NextResponse.json(
          { success: false, message: "Такой категории не существует" },
          { status: 400 },
        );
      }
    }

    const result = await db
      .collection("articles")
      .aggregate([
        {
          $group: {
            _id: null,
            maxNumericId: { $max: "$numericId" },
          },
        },
      ])
      .toArray();

    let maxNumericId = 0;
    if (
      result.length > 0 &&
      result[0].maxNumericId !== null &&
      result[0].maxNumericId !== undefined
    ) {
      maxNumericId = result[0].maxNumericId;
    }

    const newNumericId = maxNumericId + 1;

    const newArticle = {
      _id: new ObjectId(),
      numericId: newNumericId,
      name,
      slug,
      description,
      keywords,
      image,
      imageAlt,
      author,
      categoryId,
      categoryName,
      categorySlug,
      content,
      isFeatured,
      status,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(status === "published" && { publishedAt: new Date().toISOString() }),
    };

    await db.collection("articles").insertOne(newArticle);

    const responseArticle = {
      ...newArticle,
      _id: String(newArticle._id),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Статья успешно создана",
        data: responseArticle,
      },
      { status: 201 },
    );
  } catch (e) {
    console.error("Ошибка при создании новой статьи: ", e);
    return NextResponse.json(
      { success: false, message: "Ошибка при создании новой статьи" },
      { status: 500 },
    );
  }
};
