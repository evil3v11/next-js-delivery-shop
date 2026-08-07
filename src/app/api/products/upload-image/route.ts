import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
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
    const imagePath = `/images/products/${filename}`;
    const publicDir = path.join(process.cwd(), "public");
    const imagesDir = path.join(publicDir, "images", "products");
    const fullPath = path.join(imagesDir, filename);

    try {
      await fs.access(imagesDir);
    } catch {
      await fs.mkdir(imagesDir, { recursive: true });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(fullPath, buffer);

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
