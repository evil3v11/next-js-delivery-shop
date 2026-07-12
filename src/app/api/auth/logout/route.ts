import { getDB } from "@/utils/api-routes";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const sessionCookie = request.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("session="))
      ?.split("=")[1];

    if (sessionCookie) {
      const db = await getDB();
      await db.collection("session").deleteOne({ token: sessionCookie });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("session", "", {
      expires: new Date(0),
      path: "/",
    });
    return response;
  } catch (e) {
    console.error("Logout error: ", e);
    return NextResponse.json(
      { error: "Не удалось выйти из профиля" },
      { status: 500 },
    );
  }
};
