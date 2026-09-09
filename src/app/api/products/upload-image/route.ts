import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
// import sharp from "sharp";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // TODO: rewrite image uploading feature for users using sharp as well
    // /admin/cms/api/categories/upload-image
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const imageId = formData.get("imageId") as string;

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Файл не был загружен" },
        { status: 400 },
      );
    }

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: "Нет ID изображения" },
        { status: 400 },
      );
    }

    if (!image.type.includes("image")) {
      return NextResponse.json(
        { success: false, error: "Загруженный файл не является изображением" },
        { status: 400 },
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Загруженный файл больше 5 МБ" },
        { status: 400 },
      );
    }

    const filename = `img-${imageId}.jpeg`;
    const uploadDir = path.join(process.cwd(), "uploads", 'products');
    const fullPath = path.join(uploadDir, filename);

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(fullPath, buffer);

    const imagePath = `/api/uploads/products/${filename}`

    return NextResponse.json({
      success: true,
      product: {
        id: Number(imageId),
        img: imagePath,
        filename: filename,
      },
    });

  } catch (e) {
    console.error("Ошибка загрузки: ", e);
    return NextResponse.json(
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
};
