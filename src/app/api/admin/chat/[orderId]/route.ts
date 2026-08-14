import { NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";

import { ChatMessage, GetChatMessagesResponse } from "@/types/chat";

export const GET = async (request: Request, {
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<NextResponse<GetChatMessagesResponse>> => {
  try {
    const { orderId } = await params;

    const db = await getDB();
    const messages = await db
      .collection<ChatMessage>("chatMessages")
      .find({ orderId: orderId })
      .sort({ timestamp: 1 })
      .toArray();
    
    return NextResponse.json(messages, { status: 200 });
  } catch (e) {
    console.error("Ошибка при получении сообщений заказа: ", e);
    return NextResponse.json(
      { success: false, message: "Внутреняя ошибка сервера" },
      { status: 500 },
    );
  }
};
