import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/utils/api-routes";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

import type { ImageUploadResponse } from "@/types/api/upload-image";
import type { ApiResponse } from "@/types/api/default-response";

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<ImageUploadResponse>> => {
  // TODO: rewrite image uploading feature for products using sharp as well
  // /api/products/upload-image
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

    let optimizedBuffer: Buffer;
    if (originalExtension === "png") {
      optimizedBuffer = await sharp(buffer)
        .resize(800, 450, {
          fit: "fill",
          position: "center",
          withoutEnlargement: false,
        })
        .png({ quality: 80 })
        .toBuffer();
    } else if (originalExtension === "gif") {
      optimizedBuffer = await sharp(buffer)
        .resize(800, 450, {
          fit: "fill",
          position: "center",
          withoutEnlargement: false,
        })
        .gif()
        .toBuffer();
    } else {
      optimizedBuffer = await sharp(buffer)
        .resize(800, 450, {
          fit: "fill",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
          position: "center",
          withoutEnlargement: false,
        })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    const publicDir = path.join(process.cwd(), "public", "blogCategories");
    await fs.mkdir(publicDir, { recursive: true });

    const filePath = path.join(publicDir, fileName);
    await fs.writeFile(filePath, optimizedBuffer);

    const publicUrl = `/blogCategories/${fileName}`;

    return NextResponse.json(
      { success: true, url: publicUrl, fileName: fileName },
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
    
    const publicDir = path.join(process.cwd(), "public", "blogCategories");
    const pathToImage = path.join(publicDir, fileName);

    try {
      await fs.access(pathToImage);
      await fs.unlink(pathToImage);
      const db = await getDB();
      await db.collection("article-category").findOneAndUpdate(
        { image: { $regex: fileName } },
        {
          $set: {
            image: "",
            imageAlt: "",
          },
        },
      );

      return NextResponse.json({ success: true }, { status: 200 });
    } catch {
      return NextResponse.json({ success: false }, { status: 404 });
    }
  } catch (e) {
    console.error("Ошибка при удалении изображения: ", e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
