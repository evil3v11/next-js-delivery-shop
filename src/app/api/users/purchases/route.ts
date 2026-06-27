import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";
import { CONFIG } from "../../../../../config/config";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  try {
    const db = await getDB();

    const url = new URL(request.url);
    const userPurchasesLimit = url.searchParams.get("userPurchasesLimit");
    const startIndex = Number(url.searchParams.get("startIndex") || "0");
    const perPage = Number(url.searchParams.get("perPage") || String(CONFIG.ITEMS_PER_PAGE));

    const user = await db.collection("users").findOne({});

    if (!user?.purchases?.length) return NextResponse.json({ products: [], totalCount: 0 });

    const productIds = user.purchases.map((p: { id: number }) => p.id);

    if (userPurchasesLimit) {
      const limit = Number(userPurchasesLimit);

      const purchases = await db
        .collection("products")
        .find({ id: { $in: productIds } })
        .limit(limit)
        .toArray();
        
      return NextResponse.json(
        purchases.map((product) => {
          const { discountPercent, ...rest } = product;
          void discountPercent;
          return rest;
        }),
      );
    }

    const totalCount = productIds.length;

    const purchases = await db
      .collection("products")
      .find({ id: { $in: productIds } })
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(perPage)
      .toArray();

    return NextResponse.json({
      products: purchases.map((product) => {
        const { discountPercent, ...rest } = product;
        void discountPercent;
        return rest;
      }),
      totalCount,
    });
  } catch (error) {
    console.error("Server error", error);
    return NextResponse.json(
      { message: "Error fetching purchased products: " },
      { status: 500 },
    );
  }
};
