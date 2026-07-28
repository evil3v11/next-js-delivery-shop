import { getDB } from "@/utils/api-routes";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const productData = await request.json();
    const db = await getDB();

    if (!productData.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Добавьте изображение товара",
        },
        { status: 400 },
      );
    }

    const insertResult = await db.collection("products").insertOne({
      ...productData,
      id: Number(productData.id),
      basePrice: Number(productData.basePrice),
      discountPercent: Number(productData.discountPercent),
      weight: Number(productData.weight),
      quantity: Number(productData.quantity),
      img: productData.img || `/images/products/img-${productData.id}.jpeg`,
      categories: Array.isArray(productData.categories) ? productData.categories : [],
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      isHealthyFood: Boolean(productData.isHealthyFood),
      isNonGMO: Boolean(productData.isNonGMO),
      rating: {
        rate: 0,
        count: 0,
        distribution: {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0,
        },
      },
      updatedAt: new Date(),
    });

    if (!insertResult.acknowledged) {
      return NextResponse.json(
        {
          success: false,
          error: "Не удалось добавить новый товар",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        product: {
          _id: insertResult.insertedId,
          id: productData.id,
          img: productData.img,
          title: productData.title,
        },
      },
      { status: 201 },
    );
  } catch (e) {
    console.error("Внутренняяя ошибка сервера");
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Внутренняяя ошибка сервера",
      },
      { status: 500 },
    );
  }
};
