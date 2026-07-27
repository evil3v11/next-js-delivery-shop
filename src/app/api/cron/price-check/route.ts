import { checkPriceAlerts } from "@/scripts/checkPriceAlerts";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await checkPriceAlerts();

    return NextResponse.json({
      success: true,
      message: "Проверка цена завершена",
    });
  } catch (e) {
    console.error("Ошибка при проверке цен: ", e);
    return NextResponse.json({ error: "Ошибка проверки цен" }, { status: 500 });
  }
};
