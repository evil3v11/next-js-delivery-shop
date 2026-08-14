import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";

import { CONFIG } from "../../../../../config/config";
import { Product } from "@/types/product";

interface MatchCondition {
  brand: string;
  id?: { $ne: number };
}

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = request.nextUrl;
    const productId = Number(searchParams.get("productId"));
    const brand = searchParams.get("brand");
    const limit = CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS;

    if (!brand) {
      return NextResponse.json(
        { error: "Необходим бренд продукта" },
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

    const decodedBrand = decodeURIComponent(brand);
    const matchCondition: MatchCondition = {
      brand: decodedBrand,
      id: { $ne: productId },
    };

    const sameBrandProducts = await db
      .collection<Product>("products")
      .aggregate([{ $match: matchCondition }, { $sample: { size: limit } }])
      .toArray();

    if (sameBrandProducts.length === 0) {
      return NextResponse.json(
        { error: "Для данного товара нет похожих продуктов" },
        { status: 404 },
      );
    }

    return NextResponse.json(sameBrandProducts);
  } catch (e) {
    console.error("Ошибка при поиске похожих продуктов");
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
