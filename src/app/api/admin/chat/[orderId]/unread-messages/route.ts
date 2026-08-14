import { NextResponse } from "next/server";
import { getServerUserId } from "@/utils/getServerUserId";
import { getDB } from "@/utils/api-routes";

import { ChatMessage, HasUnreadChatMessagesResponse } from "@/types/chat";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ orderId: string }>; },
): Promise<NextResponse<HasUnreadChatMessagesResponse>> => {
  try {
    const { orderId } = await params;
    const userId = await getServerUserId();
    if (!userId)
      return NextResponse.json(
        { success: false, message: "Не авторизован" },
        { status: 401 },
      );

    const db = await getDB();

    const hasUnreadMessages = await db
      .collection<ChatMessage>("chatMessages")
      .findOne({ orderId, readBy: { $ne: userId } });

    return NextResponse.json(!!hasUnreadMessages);
  } catch {
    return NextResponse.json(
      { success: false, message: "Внутернняя ошибка сервера" },
      { status: 500 },
    );
  }
};
