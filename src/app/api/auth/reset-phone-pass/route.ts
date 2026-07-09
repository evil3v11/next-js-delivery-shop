import { getDB } from "@/utils/api-routes";
import bcrypt from "bcrypt";

import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { phoneNumber, password } = await request.json();
    if (!phoneNumber || !password) {
      return NextResponse.json(
        { error: "Требуется phoneNumber и password" },
        { status: 400 },
      );
    }

    const db = await getDB();
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("user").updateOne(
      { phoneNumber },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      console.log(phoneNumber)
      return NextResponse.json(
        { error: "Пользователь с таким номером не найден" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("Ошибка обновления пароля: ", e);
    return NextResponse.json(
      { error: "Внутренняя ошибка севера" },
      { status: 500 },
    );
  }
};
