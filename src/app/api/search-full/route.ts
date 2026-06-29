import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";

import { ProductCardProps } from "@/types/product";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    const db = await getDB();
    const products = (await db
      .collection("products")
      .find({
        $and: [
          {
            $or: [{ title: { $regex: query, $options: "i" } }],
          },
          { quantity: { $gt: 0 } },
        ],
      })
      .project({
        _id: 1,
        id: 1,
        img: 1,
        title: 1,
        description: 1,
        basePrice: 1,
        discountPercent: 1,
        rating: 1,
        tags: 1,
        quantity: 1,
      })
      .toArray()) as ProductCardProps[];

    return NextResponse.json(products);
  } catch (e) {
    console.error("Ошибка поиска:", e);
    return NextResponse.json({ error: "Ошибка поиска" }, { status: 500 });
  }
};
