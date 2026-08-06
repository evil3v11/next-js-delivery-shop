import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { getDates } from "@/app/(admin)/admin/delivery-schedule/_utils/getDates";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDB();
    const deliverySchedule = await db.collection("delivery-schedule").findOne({});

    if (!deliverySchedule) {
      return NextResponse.json(
        { success: false, message: "График доставок не найден" },
        { status: 404 },
      );
    }

    const currentSchedule = deliverySchedule.schedule || {};
    const newDates = getDates();
    const currentDates = Object.keys(currentSchedule);

    const datesToRemove = currentDates.filter((date) => !newDates.includes(date));
    const datesToAdd = newDates.filter((date) => !currentDates.includes(date));
    const updatedSchedule = { ...currentSchedule };

    for (const date of datesToRemove) {
      delete updatedSchedule[date];
    }

    for (const date of datesToAdd) {
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateStr = prevDate.toISOString().split("T")[0];

      if (updatedSchedule[prevDateStr]) {
        updatedSchedule[date] = { ...updatedSchedule[prevDateStr] };
      } else {
        updatedSchedule[date] = {
          "08:00-14:00": true,
          "14:00-18:00": true,
          "18:00-20:00": true,
          "20:00-22:00": true,
        };
      }
    }

    await db.collection("delivery-schedule").updateOne(
      {},
      { $set: { schedule: updatedSchedule, updatedAt: new Date() } },
    );

    return NextResponse.json({
      success: true,
      message: `Расписание обновлено. Добавлены даты: ${datesToAdd.join(", ")}, удалены даты: ${datesToRemove.join(", ")}`,
      addedDate: datesToAdd,
      removedDate: datesToRemove,
      currentDates: Object.keys(updatedSchedule),
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Ошибка CRON: ", e);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
