import {
  getBetterAuthSession,
  getCustomSessionToken,
  getUserById,
  getValidCustomSession,
} from "@/utils/auth-helpers";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const betterAuthSession = await getBetterAuthSession(request.headers);
    if (betterAuthSession) {
      const userData = await getUserById(betterAuthSession.user.id);
      if (userData) return NextResponse.json(userData);
    }
    
    const sessionToken = getCustomSessionToken(request.headers.get("cookie"))
    if (!sessionToken) return NextResponse.json({ error: "Не авторизованы" }, {status: 401});

    const session = await getValidCustomSession(sessionToken);
    if (!session) return NextResponse.json({ error: "Не авторизованы" }, {status: 401});

    const userData = await getUserById(session.userId);
    if (!userData)
      return NextResponse.json(
        { error: "Пользователя не существует" },
        { status: 404 },
      );

    return NextResponse.json(userData);
  } catch (e) {
    console.log("Error in user API: ", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
