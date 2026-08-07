import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { getServerUserId } from "@/utils/getServerUserId";
import { ObjectId } from "mongodb";
import { CreateOrderError, CreateOrderSuccess, OrderInCreation } from "@/types/order";

export const POST = async (request: NextRequest): Promise<NextResponse<CreateOrderSuccess | CreateOrderError>> => {
  try {
    const {
      paymentMethod,
      finalPrice,
      totalDiscount,
      maxBonusAmountToUse,
      totalBonuses,
      deliveryAddress,
      deliveryTime,
      cartItems,
    } = await request.json();

    console.log(deliveryTime)
    const userId = await getServerUserId();
    if (!userId) {
      return NextResponse.json(
        { error: "Нет данных о пользователе" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const user = await db.collection("user").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { error: "Такого пользователя не существует" },
        { status: 404 },
      );
    }

    const roundedTotalAmount = Math.round(((finalPrice || 0) * 100) / 100);
    const roundedDiscountAmount = Math.round(((totalDiscount || 0) * 100) / 100);
    const roundedMaxBonusAmountToUse = Math.round(((maxBonusAmountToUse || 0) * 100) / 100);
    const roundedBonusesEarned = Math.round(((totalBonuses || 0) * 100) / 100);
    const orderItems = cartItems.map(
      (item: {
        productId: number;
        quantity: number;
        price: number;
        discountPercent?: boolean;
        hasLoyaltyDiscount?: boolean;
      }) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Math.round(((item.price || 0) * 100) / 100),
        discountPercent: item.discountPercent,
        hasLoyaltyDiscount: item.hasLoyaltyDiscount,
      }),
    );

    const order: OrderInCreation = {
      userId: user._id,
      orderNumber: `${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
      status: "pending",
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "pending" : "waiting",
      totalAmount: roundedTotalAmount,
      discountAmount: roundedDiscountAmount,
      bonusesUsed: roundedMaxBonusAmountToUse,
      bonusesEarned: roundedBonusesEarned,
      deliveryAddress,
      deliveryTime,
      lastName: user.lastName,
      name: user.name,
      phone: user.phoneNumber,
      gender: user.gender,
      birthday: user.birthdayDate.toISOString().split('T')[0],
      items: orderItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const placeOrderResult = await db.collection("orders").insertOne(order);

    return NextResponse.json({
      success: true,
      order: { ...order, _id: placeOrderResult.insertedId },
      orderNumber: order.orderNumber,
    });
  } catch (e) {
    console.error("Ошибка создания заказа: ", e);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
