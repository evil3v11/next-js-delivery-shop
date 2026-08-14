import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { Product } from "@/types/product";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = request.nextUrl;
    const productId = Number(searchParams.get("productId"));
    const category = searchParams.get("category");
    const limit = Number(searchParams.get("limit")) || 4;

    if (!productId || !category) {
      return NextResponse.json(
        { error: "Необходимы ID продукта и категория" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const productExists = await db
      .collection("products")
      .findOne({ id: productId });

    if (!productExists) {
      return NextResponse.json(
        { error: "Такого продукта не существует" },
        { status: 404 },
      );
    }

    const similarProducts = await db
      .collection<Product>("products")
      .aggregate([
        {
          $match: {
            categories: { $in: [category] },
            id: { $ne: productId },
          },
        },
        { $sample: { size: limit } },
      ])
      .toArray();

    if (similarProducts.length === 0) {
      return NextResponse.json(
        { error: "Для данного товара нет похожих продуктов" },
        { status: 404 },
      );
    }

    return NextResponse.json(similarProducts);
  } catch (e) {
    console.error("Ошибка при поиске похожих продуктов");
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
