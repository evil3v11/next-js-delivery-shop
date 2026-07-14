import { getDB } from "@/utils/api-routes";
import { GridFSBucket, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const db = await getDB();
    const formData = await request.formData();

    const file = formData.get("avatar") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "Файл и userId обязательны" },
        { status: 404 },
      );
    }

    const bucket = new GridFSBucket(db, { bucketName: "avatars" });
    const userIdObject = new ObjectId(userId);

    const existingAvatar = await db
      .collection("avatars.files")
      .findOne({ "metadata.userId": userIdObject });

    if (existingAvatar) {
      try {
        await bucket.delete(existingAvatar._id);
      } catch (e) {
        console.warn("Не удалось удалить старый аватар: ", e);
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: {
        userId: userIdObject,
        originalName: file.name,
        uploadedAt: new Date(),
      },
    });

    uploadStream.end(buffer);

    const fileId = await new Promise<ObjectId>((resolve, reject) => {
      uploadStream.on("finish", () => resolve(uploadStream.id));
      uploadStream.on("error", reject);
    });

    return NextResponse.json({
      success: true,
      avatarId: fileId.toString(),
    });
  } catch (e) {
    console.log("Ошибка загрузки аватара, ", e);
    return NextResponse.json(
      { error: "Ошибка загрузки аватар" },
      { status: 500 },
    );
  }
};
