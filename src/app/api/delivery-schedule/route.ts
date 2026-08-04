import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { Schedule } from "@/types/deliverySchedule";

export const GET = async (): Promise<
  NextResponse<Schedule | { error: string }>
> => {
  try {
    const db = await getDB();
    const deliverySchedule = await db
      .collection("delivery-schedule")
      .findOne({});

    return NextResponse.json({ schedule: deliverySchedule?.schedule || {} });
  } catch (e) {
    console.error("Ошибка при запросе графика доставок: ", e);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<{ success: boolean; error?: string }>> => {
  try {
    const { schedule } = await request.json();
    const db = await getDB();

    await db
      .collection("delivery-schedule")
      .updateOne(
        {},
        { $set: { schedule: schedule || {}, updatedAt: new Date() } },
        { upsert: true },
      );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.log("Ошибка при сохранении графика доставок: ", e);
    return NextResponse.json(
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
