import { headers } from "next/headers";
import { getBetterAuthSession, getCustomSessionToken, getValidCustomSession } from "./auth-helpers";

export const getServerUserId = async () => {
  try {
    const headersList = await headers();
    const cookies = headersList.get("cookie");

    const customSessionToken = getCustomSessionToken(cookies);
    const betterAuthSessionToken = (await getBetterAuthSession(headersList))?.session.token;
    if (!customSessionToken || !customSessionToken) return null;

    let session;
    if (betterAuthSessionToken) session = await getValidCustomSession(betterAuthSessionToken);
    if (customSessionToken) session = await getValidCustomSession(customSessionToken);

    return session?.userId || null;
  } catch {
    return null;
  }
};
