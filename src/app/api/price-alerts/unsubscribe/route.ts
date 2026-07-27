import { NextRequest, NextResponse } from "next/server";
import { unsubscribeFromPriceAlert } from "@/actions/priceAlerts";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = request.nextUrl;
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    console.log("API отписки вызван был вызван с помощью: ", { token, email });

    if (!token || !email) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/product/unsubscribe/error?message=${encodeURIComponent("Неверные параметры для отписки от уведомлений")}`,
      );
    }

    const { error } = await unsubscribeFromPriceAlert(token);

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/product/unsubscribe/error?message=${encodeURIComponent(error)}`,
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/product/unsubscribe/success`,
    );
  } catch (e) {
    console.error("Ошибка при отписке: ", e);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/product/unsubscribe/error?message=${encodeURIComponent("Внутренняя ошибка сервера")}`,
    );
  }
};
