import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<{ success: boolean }>> => {
  try {
    const { id } = await params;
    const db = await getDB();

    await db.collection("comments").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: "[Комментарий удален]",
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(`Ошибка при удалении комментария: ${e}`);
    return NextResponse.json({ success: false });
  }
};
