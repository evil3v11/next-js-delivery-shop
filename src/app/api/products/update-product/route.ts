import { getDB } from "@/utils/api-routes";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const productData = await request.json();
    if (!productData.id) {
      return NextResponse.json(
        { error: "Нет ID продукта для удаления" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const dataToUpdate = {
      ...productData,
      basePrice: Number(productData.basePrice),
      discountPercent: Number(productData.discountPercent) || 0,
      weight: Number(productData.weight),
      quantity: Number(productData.quantity),
      isNonGMO: Boolean(productData.isNonGMO),
      isHealthyFood: Boolean(productData.isHealthyFood),
      categories: Array.isArray(productData.categories) ? productData.categories : [],
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      updatedAt: new Date(),
    };

    const updateResult = await db
      .collection("products")
      .updateOne({ id: Number(productData.id) }, { $set: dataToUpdate });

    if (!updateResult.modifiedCount) {
      return NextResponse.json(
        { error: "Такого продукта не существует" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Продукт успешно обновлен",
    });
  } catch (e) {
    console.error("Ошибка при обновлении продукта");
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
