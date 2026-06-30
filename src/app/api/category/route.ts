import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";
import { CONFIG } from "../../../../config/config";
import { ProductCardProps } from "@/types/product";
import { Filter } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const GET = async (request: Request) => {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const startIndex = Number(searchParams.get("startIndex") || "0");
    const perPage = Number(
      searchParams.get("perPage") || CONFIG.ITEMS_PER_PAGE_CATEGORY,
    );

    const filters = searchParams.getAll("filter");

    const query: Filter<ProductCardProps> = {};

    if (!category) {
      return NextResponse.json(
        { message: "Параметр категории обязателен" },
        { status: 400 },
      );
    }

    if (category) {
      query.categories = { $in: [category] };
    }

    if (filters.length > 0) {
      query.$and = query.$and || [];

      if (filters.includes("our-production")) {
        query.$and.push({ isOurProduction: true });
      }
      if (filters.includes("healthy-food")) {
        query.$and.push({ isHealthyFood: true });
      }
      if (filters.includes("non-gmo")) {
        query.$and.push({ isNonGMO: true });
      }
    }

    const [totalCount, products] = await Promise.all([
      db.collection<ProductCardProps>("products").countDocuments(query),
      db
        .collection<ProductCardProps>("products")
        .find(query)
        .sort({ _id: 1 })
        .skip(startIndex)
        .limit(perPage)
        .toArray(),
    ]);

    return NextResponse.json({ products, totalCount });
  } catch (error) {
    console.error("Server error", error);
    return NextResponse.json(
      { message: "Error fetching promotional products: " },
      { status: 500 },
    );
  }
};
