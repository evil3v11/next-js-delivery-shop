import { NextRequest } from "next/server";
import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export const POST = async (request: NextRequest) => {
  try {
    const { userId, password } = await request.json();

    const db = await getDB();
    const result = await db
      .collection("user")
      .updateOne(
        { _id: ObjectId.createFromHexString(userId) },
        { $set: { password: await bcrypt.hash(password, 10) } },
      );

    if (result.matchedCount === 0) {
      return Response.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("Ошибка сервера: ", e);
    return Response.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
