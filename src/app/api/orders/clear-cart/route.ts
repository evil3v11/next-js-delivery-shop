import { ApiResponse } from "@/types/api/default-response";
import { getDB } from "@/utils/api-routes";
import { getServerUserId } from "@/utils/getServerUserId";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (): Promise<NextResponse<ApiResponse>> => {
  try {
    const userId = await getServerUserId();
    if (!userId)
      return NextResponse.json(
        { success: false, message: "Не авторизован" },
        { status: 401 },
      );

    const db = await getDB();
    await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: { cart: [], updatedAt: new Date() },
      },
    );

    return NextResponse.json(
      { success: true, message: "Корзина очищена успешно" },
      { status: 200 }
    )
  } catch (e) {
    console.log("Ошибка при очистке корзины: ", e)
    return NextResponse.json(
      { success: false, message: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
};
