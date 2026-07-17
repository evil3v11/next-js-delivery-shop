import { getDB } from "@/utils/api-routes";
import { deleteUserAvatarFromGridFS } from "@/utils/deleteUserAvatar";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { userId } = await request.json();
    const db = await getDB();

    const deleteResult = await db
      .collection("user")
      .deleteOne({ _id: new ObjectId(userId) });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: "Такого пользователя не существует" },
        { status: 404 },
      );
    }

    await deleteUserAvatarFromGridFS(userId);

    return NextResponse.json({ success: true });
  } catch {
    console.error("Внутренняя ошибка сервера");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
