import { UpdateUserDataAfterPaymentResponse } from "@/types/order";
import { getDB } from "@/utils/api-routes";
import { getServerUserId } from "@/utils/getServerUserId";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest): Promise<NextResponse<UpdateUserDataAfterPaymentResponse>> => {
  try {
    const { usedBonuses, earnedBonuses, purchasedProductIds } = await request.json();

    const userId = await getServerUserId();
    if (!userId) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });

    const db = await getDB();
    let userIdObject;
    try {
      userIdObject = new ObjectId(userId);
    } catch {
      console.error("Неправильный ID пользователя: ", userId);
      return NextResponse.json({ message: "Неправильный ID пользователя" }, { status: 400 });
    }

    const user = await db.collection("user").findOne({ _id: userIdObject });
    if (!user) return NextResponse.json({ message: "Пользователя не существует" }, { status: 404 });

    const currentBonuses = user.bonusesAmount || 0;
    const usedBonusesNumber = Number(usedBonuses) || 0;
    const earnedBonusesNumber = Number(earnedBonuses) || 0;

    if (usedBonusesNumber > currentBonuses) {
      return NextResponse.json(
        {
          message: "Недостаточно бонусов",
          availableBonuses: currentBonuses,
          requiredBonuses: usedBonusesNumber,
        },
        { status: 400 },
      );
    }

    const newBonusesAmount = currentBonuses - usedBonusesNumber + earnedBonusesNumber;
    const numPurchasedIds = purchasedProductIds.map(Number);
    const currentPurchases = Array.isArray(user.purchases) ? user.purchases : [];
    const updatedPurchases = [...currentPurchases, ...numPurchasedIds];

    const updateResult = await db.collection("user").updateOne(
      { _id: userIdObject },
      {
        $set: {
          bonusesAmount: newBonusesAmount,
          purchases: updatedPurchases,
          cart: [],
          updatedAt: new Date(),
        },
      },
    );

    if (!updateResult.modifiedCount) return NextResponse.json({ message: "Данные не обновлены" }, { status: 500 });

    return NextResponse.json({
      success: true,
      message: "Пользователь успешно обновлен",
      updatedFields: {
        bonusesDeducted: usedBonusesNumber,
        bonusesAdded: earnedBonusesNumber,
        newBonusesAmount,
        productsAdded: numPurchasedIds.length,
        totalPurchases: updatedPurchases.length,
        cartCleared: true,
      },
    });
  } catch (e) {
    console.error("Ошибка при обновлении данных пользователя: ", e);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
