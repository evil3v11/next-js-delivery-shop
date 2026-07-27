import { getDB } from "@/utils/api-routes";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
): Promise<NextResponse> => {
  try {
    const { productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: "Необходим ID продукта" },
        { status: 400 },
      );
    }

    const db = await getDB();
    const product = await db
      .collection("products")
      .findOne({ id: Number(productId) });

    if (!product) {
      return NextResponse.json(
        { error: "Такого продукта не существует" },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (e) {
    console.error("Произшла ошибка сервера");
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
