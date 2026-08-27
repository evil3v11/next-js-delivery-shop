import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import type { ImageUploadResponse } from "@/types/api/upload-image";
import type { ApiResponse } from "@/types/api/default-response";

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<ImageUploadResponse>> => {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json(
        { success: false, message: "Файл не предоставлен" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name;
    const originalExtension = originalName.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
    const fileName = `${timestamp}_${random}.${originalExtension}`;

    const uploadDir = path.join(process.cwd(), "public", 'uploads', "articles");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/articles/${fileName}`;

    return NextResponse.json(
      { success: true, url: publicUrl, fileName },
      { status: 201 },
    );
  } catch (e) {
    console.error("Ошибка при обработке изображения: ", e);
    return NextResponse.json(
      { success: false, message: "Ошибка при обработке изображения" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  request: NextRequest,
): Promise<NextResponse<Pick<ApiResponse, "success">>> => {
  try {
    const fileName = request.nextUrl.searchParams.get("file");
    if (!fileName) return NextResponse.json({ success: false }, { status: 400 });

    const uploadDir = path.join(process.cwd(), "public", 'uploads', "articles");
    const pathToImage = path.join(uploadDir, fileName)

    try {
      await fs.access(pathToImage);
      await fs.unlink(pathToImage);
      return NextResponse.json({ success: true }, { status: 200 });
    } catch {
      return NextResponse.json({ success: false }, { status: 404 });
    }
  } catch (e) {
    console.error("Ошибка при удалении изображения: ", e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
