import { getDB } from "@/utils/api-routes";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Нет ID продукта для удаления" },
        { status: 400 },
      );
    }

    const db = await getDB();
    const deleteResult = await db
      .collection("products")
      .deleteOne({ id: Number(id) });

    if (!deleteResult.deletedCount) {
      return NextResponse.json(
        { error: "Такого продукта не существует" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Продукт успешно удален",
    });
  } catch (e) {
    console.error("Ошибка при удалении продукта");
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
