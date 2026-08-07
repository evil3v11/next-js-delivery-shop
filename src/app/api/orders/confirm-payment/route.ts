import { ConfirmPaymentResponse } from "@/types/api/confirm-payment";
import { OrderInCreation } from "@/types/order";
import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest): Promise<NextResponse<ConfirmPaymentResponse>> => {
  try {
    const { orderId } = await request.json();
    if (!orderId)
      return NextResponse.json(
        { success: false, message: "Нет ID заказа" },
        { status: 400 },
      );

    const db = await getDB();
    const order = await db.collection<OrderInCreation>("orders").findOne({ _id: new ObjectId(orderId) });
    if (!order)
      return NextResponse.json(
        { success: false, message: "Такого заказа не существует" },
        { status: 400 },
      );

    for (const item of order.items) {
      const productId = Number(item.productId);
      await db.collection("products").updateOne(
        { id: productId },
        {
          $inc: { quantity: -item.quantity },
          $set: { updatedAt: new Date() },
        },
      );
    }

    await db.collection('orders').updateOne(
      {_id: new ObjectId(orderId)}, {
      $set: {
        status: "confirmed",
        paymentStatus: "paid",
        paidAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(
      { success: true, message: "Оплата подверждена" },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка проверки оплаты заказа: ", e);
    return NextResponse.json(
      { success: false, message: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
