import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";
import { SearchProduct } from "@/types/searchProducts";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    const db = await getDB();
    const products = await db
      .collection("products")
      .find({
        $or: [{ title: { $regex: query, $options: "i" } }],
      })
      .project({
        title: 1,
        categories: 1,
        id: 1,
      })
      .toArray();

    if (!products.length) return NextResponse.json([]);

    const groupedByCategory: Record<string, SearchProduct[]> = {};

    for (const item of products) {
      for (const category of item.categories) {
        if (!groupedByCategory[category]) groupedByCategory[category] = [];

        groupedByCategory[category].push(item as SearchProduct);
      }
    }

    const result = Object.entries(groupedByCategory).map(
      ([category, products]) => ({
        category,
        products,
      }),
    );

    return NextResponse.json(result);
  } catch (e) {
    console.error("Ошибка поиска:", e);
    return NextResponse.json({ error: "Ошибка поиска" }, { status: 500 });
  }
};
