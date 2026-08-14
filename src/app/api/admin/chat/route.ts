import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import { getServerUserId } from "@/utils/getServerUserId";

import { PostChatMessageResponse } from "@/types/chat";

export const POST = async (request: NextRequest): Promise<NextResponse<PostChatMessageResponse>> => {
  try {
    const userId = await getServerUserId();
    if (!userId) return NextResponse.json({ success: false, message: "Не авторизован" }, { status: 401 });

    const message = await request.json();
    const db = await getDB();

    const chatMessage = {
      ...message,
      userId,
      timestamp: new Date(),
      readBy: [userId],
    };

    const result = await db.collection("chatMessages").insertOne(chatMessage);

    return NextResponse.json(
      {
        success: true,
        message: { ...chatMessage, _id: result.insertedId },
      },
      { status: 200 },
    );
  } catch (e) {
    console.error("Ошибка при отправке сообщения: ", e);
    return NextResponse.json(
      { success: false, message: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
