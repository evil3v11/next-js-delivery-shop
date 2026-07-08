import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { login, loginType } = await request.json();
    const db = await getDB();
    const query =
      loginType === "email"
        ? { email: login }
        : { phoneNumber: login.replace(/\D/g, "") };

    const user = await db.collection("user").findOne(query);

    if (!user) return NextResponse.json({ exists: false, verified: false });

    const verified =
      loginType === "email" ? !!user.emailVerified : !!user.phoneNumberVerified;

    return NextResponse.json({ exists: true, verified });
  } catch (e) {
    console.error("Ошибка проверки логина: ", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
};
