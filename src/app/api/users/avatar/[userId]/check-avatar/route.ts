import { getDB } from "@/utils/api-routes";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  {
    params,
  }: {
    params: Promise<{ userId: string }>;
  },
) => {
  try {
    const { userId } = await params;
    const db = await getDB();
    let objectId: ObjectId;

    if (!userId) {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    try {
      objectId = new ObjectId(userId);
    } catch {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    const fileExists = await db
      .collection("avatars.files")
      .findOne({ "metadata.userId": objectId });

    return NextResponse.json({ exists: !!fileExists });
  } catch (e) {
    console.error("Ошибка при проверке аватара: ", e);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
};
