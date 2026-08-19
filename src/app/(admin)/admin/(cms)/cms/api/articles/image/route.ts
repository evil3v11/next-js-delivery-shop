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
    const categorySlug = String(formData.get('categorySlug'))
    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json(
        { success: false, message: "Файл не предоставлен" },
        { status: 400 },
      );
    }

    const categoryFolder = categorySlug.trim() || 'uncategorized'

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name;
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const cleanName = baseName
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]/g, "")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");

    const timestamp = Date.now();
    const safeName = cleanName || "image";

    const originalExtension =
      originalName.split(".").pop()?.toLowerCase() || ".jpg";
    const fileName = `${safeName}_${timestamp}.${originalExtension}`;

    const publicDir = path.join(process.cwd(), "public", "articles", categoryFolder);
    await fs.mkdir(publicDir, { recursive: true });

    const filePath = path.join(publicDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/articles/${categoryFolder}/${fileName}`;

    return NextResponse.json(
      { success: true, url: publicUrl, fileName, category: categoryFolder },
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
    const category = request.nextUrl.searchParams.get("categorySlug");
    if (!fileName || !category) return NextResponse.json({ success: false }, { status: 400 });

    const categoryFolder = category.trim()
    const publicDir = path.join(process.cwd(), "public", "articles", categoryFolder);
    const pathToImage = path.join(publicDir, fileName)

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
