import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";
import { CONFIG } from "../../../../config/config";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const GET = async (request: Request) => {
  try {
    const db = await getDB();
    const url = new URL(request.url);

    const articlesLimit = url.searchParams.get("randomLimit");
    const startIndex = Number(url.searchParams.get("startIndex") || "0");
    const perPage = Number(url.searchParams.get("perPage") || String(CONFIG.ITEMS_PER_PAGE_MAIN_ARTICLES));

    if (articlesLimit) {
      const limit = Number(articlesLimit)
      const articles = await db
        .collection("articles")
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      return NextResponse.json(articles);
    }

    const totalCount = await db.collection("articles").countDocuments();

    const articles = await db
      .collection("articles")
      .find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(perPage)
      .toArray();

    return NextResponse.json({ articles, totalCount });
  } catch (error) {
    console.error("Server error", error);
    return NextResponse.json(
      { message: "Error fetching articles" },
      { status: 500 },
    );
  }
};
