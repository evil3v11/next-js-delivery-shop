import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { CONFIG } from "../../../../../../config/config";
import { Product } from "@/types/product";
import { Filter, ObjectId } from "mongodb";
import { UserData } from "@/types/userData";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const GET = async (request: NextRequest) => {
  try {
    const db = await getDB();
    const { searchParams } = request.nextUrl;

    const startIndex = Number(searchParams.get("startIndex") || "0");
    const perPage = Number(
      searchParams.get("perPage") || CONFIG.ITEMS_PER_PAGE_CATEGORY,
    );

    const filters = searchParams.getAll("filter");
    const priceFrom = searchParams.get("priceFrom");
    const priceTo = searchParams.get("priceTo");
    const getPriceRangeOnly = searchParams.get("getPriceRangeOnly") === "true";
    const inStock = searchParams.get("inStock") === "true";

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { products: [], totalCount: 0 },
        { status: 400 },
      );
    }

    if (getPriceRangeOnly) {
      const user = await db
        .collection<UserData>("user")
        .findOne({ _id: new ObjectId(userId) });

      const favoriteProductsIds = user?.favorites || [];
      const numbericFavIds = favoriteProductsIds.map((id: string) =>
        Number(id),
      );

      if (!numbericFavIds.length) {
        return NextResponse.json(
          { products: [], totalCount: 0 },
          { status: 200 },
        );
      }

      const query: Filter<Product> = {
        id: { $in: numbericFavIds },
      };

      const priceRange = await db
        .collection<Product>("products")
        .aggregate([
          { $match: query },
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
          min: priceRange[0]?.min || CONFIG.FALLBACK_PRICE_RANGE.min,
          max: priceRange[0]?.max || CONFIG.FALLBACK_PRICE_RANGE.max,
        },
      });
    }

    const user = await db
      .collection<UserData>("user")
      .findOne({ _id: new ObjectId(userId) });

    const favoriteProductsIds = user?.favorites || [];
    const numbericFavIds = favoriteProductsIds.map((id: string) => Number(id));

    if (!numbericFavIds.length) {
      return NextResponse.json(
        { products: [], totalCount: 0 },
        { status: 200 },
      );
    }

    const query: Filter<Product> = {
      id: { $in: numbericFavIds },
    };

    if (inStock) {
      query.quantity = { $gt: 0 };
    }

    if (filters.length > 0) {
      query.$and = query.$and || [];

      if (filters.includes("our-production")) {
        query.$and.push({ manufacturer: "Россия" });
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
      db.collection<Product>("products").countDocuments(query),
      db
        .collection<Product>("products")
        .find(query)
        .sort({ _id: 1 })
        .skip(startIndex)
        .limit(perPage)
        .toArray(),
    ]);

    const actualPriceRange =
      products.length > 0
        ? {
            min: Math.min(...products.map((p) => p.basePrice)),
            max: Math.max(...products.map((p) => p.basePrice)),
          }
        : CONFIG.FALLBACK_PRICE_RANGE;

    return NextResponse.json({
      products,
      totalCount,
      priceRange: actualPriceRange,
    });
  } catch (error) {
    console.error("Server error", error);
    return NextResponse.json(
      { message: "Error fetching promotional products: " },
      { status: 500 },
    );
  }
};
