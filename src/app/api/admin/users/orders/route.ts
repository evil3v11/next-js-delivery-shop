import { GetAdminOrders } from "@/types/api/orders"
import { Order } from "@/types/order"
import { getDB } from "@/utils/api-routes"
import { formatDateToString } from "@/utils/formatDateToString"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export const GET = async (): Promise<NextResponse<GetAdminOrders>> => {
  try {
    const db = await getDB()

    const today = new Date()
    const oneMonthAgo = new Date(today)
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

    const oneMonthAgoString = formatDateToString(oneMonthAgo)
    const dayAfterTomorrowString = formatDateToString(dayAfterTomorrow)
    const todayStr = formatDateToString(today)

    const orders = await db.collection<Order>('orders').find({
      'deliveryTime.date': {
        $gte: oneMonthAgoString,
        $lte: dayAfterTomorrowString
      }
    }).sort({ 'deliveryTime.date': -1, 'deliveryTime.timeSlot': 1 }).toArray()

    const amountOfNextThreeDaysOfOrders = orders.filter(
      (o) => o.deliveryTime.date >= todayStr && o.deliveryTime.date <= dayAfterTomorrowString
    ).length

    return NextResponse.json({ success: true, orders, stats: { amountOfNextThreeDaysOfOrders } }, { status: 200 })
  } catch (e) {
    console.error("Ошибка при загрузке заказов:", e)
    return NextResponse.json({
      success: false,
      message: 'Ошибка при загрузке заказов'
    }, { status: 500 })
  }
}