import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";
import { CONFIG } from "../../../../../config/config";
import { ObjectId } from "mongodb";
import { FetchPurchasesError, FetchPurchasesResponse } from "@/types/purchases";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

export const GET = async (request: Request): Promise<NextResponse<FetchPurchasesResponse | FetchPurchasesError>> => {
  try {
    const db = await getDB();

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) return NextResponse.json({ products: [], totalCount: 0 });

    const userPurchasesLimit = url.searchParams.get("userPurchasesLimit");
    const startIndex = Number(url.searchParams.get("startIndex") || "0");
    const perPage = Number(url.searchParams.get("perPage") || String(CONFIG.ITEMS_PER_PAGE));

    const user = await db.collection("user").findOne({ _id: new ObjectId(userId) });

    if (!user?.purchases?.length) return NextResponse.json({ products: [], totalCount: 0 });

    const productIds = user.purchases

    if (userPurchasesLimit) {
      const limit = Number(userPurchasesLimit);

      const purchasedProducts = await db
        .collection<Product>("products")
        .find({ id: { $in: productIds } })
        .limit(limit)
        .toArray();

      return NextResponse.json({
        products: purchasedProducts.map(({ discountPercent, ...rest }) => rest as Product),
        totalCount: purchasedProducts.length
      });
    }

    const totalCount = productIds.length;

    const purchasedProducts = await db
      .collection<Product>("products")
      .find({ id: { $in: productIds } })
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(perPage)
      .toArray();

    return NextResponse.json({
      products: purchasedProducts.map(({ discountPercent, ...rest }) => rest as Product),
      totalCount,
    });
  } catch (e) {
    console.error("Server error", e);
    return NextResponse.json(
      { message: "Error fetching purchased products: " },
      { status: 500 },
    );
  }
};
