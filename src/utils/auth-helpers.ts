import { auth } from "@/lib/auth";
import { getDB } from "./api-routes";
import { ObjectId } from "mongodb";
import { UserData } from "@/types/userData";

export const getBetterAuthSession = async (headers: Headers) => {
  try {
    return await auth.api.getSession({ headers });
  } catch (e) {
    console.log("Better-Auth session check failed: ", e);
    return null;
  }
};

export const getCustomSessionToken = (
  cookieHeader: string | null,
): string | null => {
  const cookies = (cookieHeader || "").split(";").map((c) => c.trim());
  return cookies.find((c) => c.startsWith("session="))?.split("=")[1] || null;
};

export const validateCustomSession = async (sessionToken: string) => {
  const db = await getDB();
  const session = await db
    .collection("session")
    .findOne({ token: sessionToken });
  return !!session && new Date(session.expiresAt) > new Date();
};

export const getUserById = async (userId: string) => {
  const db = await getDB();
  const user = await db
    .collection<UserData>("user")
    .findOne({ _id: new ObjectId(userId) });

  if (!user) return null;

  return {
    ...user,
    id: String(user._id),
  };
};

export const getValidCustomSession = async (sessionToken: string) => {
  const db = await getDB();
  const session = await db
    .collection("session")
    .findOne({ token: sessionToken });

  if (!session || new Date(session.expiresAt) < new Date()) return null;
  return session;
};
