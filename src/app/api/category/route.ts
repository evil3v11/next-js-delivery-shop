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
    const priceFrom = searchParams.get("priceFrom");
    const priceTo = searchParams.get("priceTo");
    const getPriceRangeOnly = searchParams.get("getPriceRangeOnly") === "true";
    const inStock = searchParams.get("inStock") === "true";

    const query: Filter<ProductCardProps> = {};

    if (!category) {
      return NextResponse.json(
        { message: "Параметр категории обязателен" },
        { status: 400 },
      );
    }

    if (getPriceRangeOnly) {
      const categoryOnlyQuery: Filter<ProductCardProps> = {};

      categoryOnlyQuery.categories = { $in: [category] };
      const priceRange = await db
        .collection<ProductCardProps>("products")
        .aggregate([
          { $match: categoryOnlyQuery },
          {
            $group: {
              _id: null,
              min: { $min: "$basePrice" },
              max: { $max: "$basePrice" },
            },
          },
        ])
        .toArray();

      return NextResponse.json({
        priceRange: {
          min: priceRange[0]?.min || 0,
          max: priceRange[0]?.max || CONFIG.FALLBACK_PRICE_RANGE.max,
        },
      });
    }

    if (category) {
      query.categories = { $in: [category] };
    }

    if (inStock) {
      query.quantity = { $gt: 0 };
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

    if (priceFrom || priceTo) {
      query.basePrice = {};
      if (priceFrom) query.basePrice.$gte = Number(priceFrom);
      if (priceTo) query.basePrice.$lte = Number(priceTo);
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

    return NextResponse.json({
      products,
      totalCount,
      priceRange: {
        min: 0,
        max: 0,
      },
    });
  } catch (error) {
    console.error("Server error", error);
    return NextResponse.json(
      { message: "Error fetching promotional products: " },
      { status: 500 },
    );
  }
};
