import { UpdateUserDataAfterPaymentResponse } from "@/types/api/update-user-after-payment";
import { Order } from "@/types/order";
import { getDB } from "@/utils/api-routes";
import { getServerUserId } from "@/utils/getServerUserId";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest): Promise<NextResponse<UpdateUserDataAfterPaymentResponse>> => {
  try {
    const { orderId, usedBonuses, earnedBonuses, purchasedProductIds } = await request.json();

    if (!orderId) return NextResponse.json({ success: false, message: "Нет данных о заказе" }, { status: 400 });

    const userId = await getServerUserId();
    if (!userId) return NextResponse.json({ success: false, message: "Не авторизован" }, { status: 401 });

    const db = await getDB();
    let userIdObject;
    let orderIdObject
    try {
      userIdObject = new ObjectId(userId);
      orderIdObject = new ObjectId(orderId)
    } catch {
      console.error("Неправильный ID пользователя: ", userId);
      return NextResponse.json({ success: false, message: "Неправильный ID пользователя" }, { status: 400 });
    }

    const [user, order] = await Promise.all([
      db.collection("user").findOne({ _id: userIdObject }),
      db.collection<Order>('orders').findOne({_id: orderIdObject})
    ])
    if (!user) return NextResponse.json({ success: false, message: "Пользователя не существует" }, { status: 404 });
    if (!order) return NextResponse.json({ success: false, message: "Такого заказа не существует" }, { status: 404 });

    if (usedBonuses || earnedBonuses) {
      const currentBonuses = user.bonusesAmount || 0;
      const usedBonusesNumber = Number(usedBonuses) || 0;
      const earnedBonusesNumber = Number(earnedBonuses) || 0;
  
      if (usedBonusesNumber > currentBonuses) {
        return NextResponse.json(
          {
            success: false,
            message: "Недостаточно бонусов",
            availableBonuses: currentBonuses,
            requiredBonuses: usedBonusesNumber,
          },
          { status: 400 },
        );
      }

      const newBonusesAmount = currentBonuses - usedBonusesNumber + earnedBonusesNumber;
      let updatedPurchases = Array.isArray(user.purchases) ? user.purchases : [];

      if (purchasedProductIds.length > 0) {
        const numPurchasedIds = purchasedProductIds.map(Number);

        const uniqueNewIds = numPurchasedIds.filter((id: number, i: number, array: number[]) => array.indexOf(id) === i)
        const allPurchases = [...updatedPurchases, ...uniqueNewIds];
        updatedPurchases = allPurchases.filter((id: number, i: number, array: number[]) => array.indexOf(id) === i)
      }

  
      await db.collection("user").updateOne(
        { _id: userIdObject },
        {
          $set: {
            bonusesAmount: newBonusesAmount,
            purchases: updatedPurchases,
            updatedAt: new Date(),
          },
        },
      );
    }

    for (const item of order.items) {
      const productId = Number(item.productId)
      await db.collection('products').updateOne({id: productId}, {
        $inc: { quantity: -item.quantity} ,
        $set: { updatedAt: new Date() }
      })
    }

    await db.collection<Order>('orders').updateOne({_id: orderIdObject}, {
      $set: {
        status: 'confirmed',
        paymentStatus: 'paid',
        paidAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: "Оплата подтверждена, товары списаны и данные пользователя обновлены"
    });
  } catch (e) {
    console.error("Ошибка при обновлении данных пользователя: ", e);
    return NextResponse.json(
      { success: false, message: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
