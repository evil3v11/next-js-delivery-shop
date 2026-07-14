import { getDB } from "@/utils/api-routes";
import { GridFSBucket, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) => {
  try {
    const { userId } = await params;
    const db = await getDB();

    const bucket = new GridFSBucket(db, { bucketName: "avatars" });

    if (!userId) {
      return NextResponse.json(
        { error: "User ID не предоставлен" },
        { status: 400 },
      );
    }

    let userIdObject;
    try {
      userIdObject = new ObjectId(userId);
    } catch {
      return NextResponse.json(
        { error: "Ошибка формат User ID" },
        { status: 400 },
      );
    }

    const fileExists = await db.collection("avatars.files").findOne({
      "metadata.userId": userIdObject,
    });

    if (!fileExists)
      return NextResponse.json(
        { error: "Такого аватара не существует" },
        { status: 404 },
      );

    const downloadStream = bucket.openDownloadStream(fileExists._id);
    const chunks: Buffer[] = [];

    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }

    if (chunks.length === 0) {
      return NextResponse.json(
        { error: "Файл аватара пустой" },
        { status: 404 },
      );
    }

    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      status: 200,
      headers: {
        "content-type": fileExists.contentType || "image/jpeg",
        "content-length": String(buffer.length),
        "cache-control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Ошибка получения аватара" },
      { status: 500 },
    );
  }
};
