import { NextResponse } from "next/server";
import { getServerUserId } from "@/utils/getServerUserId";
import { getDB } from "@/utils/api-routes";
import { ChatMessage } from "@/types/chat";
import { ApiResponse } from "@/types/api/default-response";

export const POST = async (request: Request, {
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<NextResponse<ApiResponse>> => {
  try {
    const { orderId } = await params;
    const userId = await getServerUserId();
    const db = await getDB();

    await db
      .collection<ChatMessage>("chatMessages")
      .updateMany(
        { orderId, readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } },
      );

    return NextResponse.json({
      success: true,
      message: "Сообщение успешно прочтено",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Внутернняя ошибка сервера" },
      { status: 500 }
    );
  }
};
