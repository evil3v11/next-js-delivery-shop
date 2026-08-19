import { NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";

import { BlogCategory } from "@/app/(blog)/blog/categories/_types/categories";
import { GetBlogCategoriesResponse } from "@/app/(admin)/admin/(cms)/cms/_types";

export const GET = async (): Promise<
  NextResponse<GetBlogCategoriesResponse>
> => {
  try {
    const db = await getDB();
    const categories = await db
      .collection<BlogCategory>("article-category")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при запросе категорий: ", e);
    return NextResponse.json(
      { success: false, message: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
