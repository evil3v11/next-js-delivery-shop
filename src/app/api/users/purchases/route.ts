import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const db = await getDB();
    const user = await db.collection("users").findOne({});

    if (!user?.purchases?.length) {
      return NextResponse.json([]);
    }

    const productIds = user.purchases.map((p: { id: number }) => p.id);

    const products = await db
      .collection("products")
      .find({ id: { $in: productIds } })
      .toArray();

    return NextResponse.json(
      products.map((product) => {
        const { discountPercent, ...rest } = product;
        void discountPercent;
        return rest;
      }),
    );
  } catch (error) {
    console.error("Server error", error);
    return NextResponse.json(
      { message: "Error fetching purchased products: " },
      { status: 500 },
    );
  }
};
