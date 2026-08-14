import { ApiResponse } from "@/types/api/default-response";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

type UpdateData = {
  updatedAt: Date;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

export const POST = async (request: NextRequest): Promise<NextResponse<ApiResponse>> => {
  try {
    const { orderId, status, paymentStatus } = await request.json()
    if (!orderId) return NextResponse.json({ success: false, message: 'Нет данных о заказе' }, { status: 400 })
    if (!status && !paymentStatus) return NextResponse.json({ success: false, message: 'Необходимо указать статус заказа или статус платежа' }, { status: 400 })

    const db = await getDB()

    const updateData: UpdateData = {
      updatedAt: new Date(),
    }

    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const updateResult = await db.collection<Order>('orders').updateOne(
      { _id: new ObjectId(orderId) }, 
      { $set: updateData }
    )

    if (!updateResult.modifiedCount) return NextResponse.json({ success: false, message: 'Такого заказа не существует' }, { status: 404 })

    return NextResponse.json({ success: true, message: 'Статус заказа успешно обновлен' }, { status: 200 })
  } catch (e) {
    console.error(`Ошибка при обновлении статуса заказа: ${e}`)
    return NextResponse.json({ success: false, message: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}