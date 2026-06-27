import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";
import { CONFIG } from "../../../../config/config";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const GET = async (request: Request) => {
  try {
    const db = await getDB();
    const url = new URL(request.url);

    const category = url.searchParams.get("category");
    const randomLimit = url.searchParams.get("randomLimit");
    const startIndex = Number(url.searchParams.get("startIndex") || "0");
    const perPage = Number(url.searchParams.get("perPage") || CONFIG.ITEMS_PER_PAGE);

    if (!category) {
      return NextResponse.json(
        { message: "Параметр категории обязателен" },
        { status: 400 },
      );
    }

    const query = {
      categories: category,
      quantity: { $gt: 0 },
    };

    if (randomLimit) {
      const pipeline = [
        { $match: query },
        { $sample: { size: Number(randomLimit) } },
      ];

      const products = await db
        .collection("products")
        .aggregate(pipeline)
        .toArray();

      return NextResponse.json(products);
    }

    const totalCount = await db.collection("products").countDocuments(query);

    const products = await db
      .collection("products")
      .find(query)
      .sort({ _id: 1 })
      .skip(startIndex)
      .limit(perPage)
      .toArray();

    return NextResponse.json({ products, totalCount });
  } catch (error) {
    console.error("Server error", error);
    return NextResponse.json(
      { message: "Error fetching promotional products: " },
      { status: 500 },
    );
  }
};
