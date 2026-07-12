import { NextResponse } from "next/server";
import {
  getBetterAuthSession,
  getCustomSessionToken,
  validateCustomSession,
} from "@/utils/auth-helpers";

export const GET = async (request: Request) => {
  try {
    const betterAuthSession = await getBetterAuthSession(request.headers);
    if (betterAuthSession) return NextResponse.json({ isAuth: true });
    
    const sessionToken = getCustomSessionToken(request.headers.get("cookie"));
    if (!sessionToken) return NextResponse.json({ isAuth: false });

    const isAuth = await validateCustomSession(sessionToken);
    return NextResponse.json({ isAuth });
  } catch (e) {
    console.error("Error in check-session: ", e);
    return NextResponse.json({ isAuth: false });
  }
};
