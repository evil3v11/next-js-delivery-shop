import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { ProductCardProps } from "@/types/product";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Нет запроса для поиска" },
        { status: 400 },
      );
    }

    const db = await getDB();
    const searchRegExp = new RegExp(query.trim(), "i");
    const products = await db
      .collection<ProductCardProps[]>("products")
      .find({
        $or: [
          { title: { $regex: searchRegExp } },
          { description: { $regex: searchRegExp } },
          { article: { $regex: searchRegExp } },
        ],
      })
      .project({
        id: 1,
        title: 1,
        article: 1,
        basePrice: 1,
        quantity: 1,
        categories: 1,
      })
      .sort({ title: 1 })
      .toArray();

    if (!products.length) {
      return NextResponse.json(
        { error: "Нет продуктов по такому запросу" },
        { status: 404 },
      );
    }

    return NextResponse.json(products);
  } catch (e) {
    console.error("Ошибка при поиске продуктов");
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
