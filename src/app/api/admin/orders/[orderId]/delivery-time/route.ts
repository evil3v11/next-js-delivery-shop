import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";

import type { ApiResponse } from "@/types/api/default-response";

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<NextResponse<ApiResponse>> => {
  try {
    const { orderId } = await params;
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Нет информации о заказе" },
        { status: 400 },
      );
    }

    const { deliveryDate, deliveryTimeSlot } = await request.json();
    if (!deliveryDate || !deliveryTimeSlot) {
      return NextResponse.json(
        { success: false, message: "Нет данных о времени заказа" },
        { status: 400 },
      );
    }

    const db = await getDB();
    const orderObjectId = new ObjectId(orderId);

    const updateResult = await db.collection("orders").updateOne(
      { _id: orderObjectId },
      {
        $set: {
          "deliveryTime.date": deliveryDate,
          "deliveryTime.timeSlot": deliveryTimeSlot,
          updatedAt: new Date(),
        },
      },
    );

    if (!updateResult.modifiedCount) {
      return NextResponse.json(
        { success: false, message: "Такого заказа не существует" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Время доставки заказ успешно обновлено" },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при обновлении времени доставки: ", e);
    return NextResponse.json(
      { success: true, message: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
