import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";

import { CONFIG } from "../../../../../config/config";

import type { ApiResponse } from "@/types/api/default-response";
import type {
  Article,
  Category,
  CategoryPageResponse,
} from "@/types/entities";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ categorySlug: string }> },
): Promise<NextResponse<CategoryPageResponse | ApiResponse>> => {
  try {
    const { categorySlug } = await params;
    const searchParams = request.nextUrl.searchParams;

    const page = Number(searchParams.get("page")) || 1;
    const itemsPerPage = Number(searchParams.get("itemsPerPage")) || CONFIG.ARTICLES_PER_BLOG_PAGE;
    const skip = (page - 1) * itemsPerPage;

    const db = await getDB();

    const categoryDocument = await db
      .collection<Category>("article-category")
      .findOne({ slug: categorySlug });

    if (!categoryDocument) {
      return NextResponse.json(
        { success: false, message: "Категория не найдена" },
        { status: 404 },
      );
    }

    const totalArticles = await db.collection("articles").countDocuments({
      categoryId: String(categoryDocument._id),
      status: "published",
    });

    const articlesDocumnent = await db
      .collection<Article>("articles")
      .find(
        { categoryId: String(categoryDocument._id), status: "published" },
        {
          projection: {
            _id: 1,
            slug: 1,
            name: 1,
            image: 1,
            imageAlt: 1,
            description: 1,
            publishedAt: 1,
            isFeatured: 1,
          },
        },
      )
      .sort({ isFeatured: -1 , publishedAt: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .toArray();

    const totalPages = Math.ceil(totalArticles / itemsPerPage);
    const articles = articlesDocumnent.map((a) => ({
      ...a,
      _id: String(a._id),
    }));
    const category = {
      ...categoryDocument,
      _id: String(categoryDocument._id),
    };

    return NextResponse.json(
      {
        category,
        articles,
        totalArticles,
        totalPages,
        currentPage: page,
        itemsPerPage,
      },
      { status: 200 },
    );
  } catch (e) {
    console.error("Error fetching category data: ", e);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
};
