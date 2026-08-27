import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import { ApiResponse } from "@/types/api/default-response";
import { TempImageUploadResult } from "../../../articles/_types";

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<ApiResponse & { data?: TempImageUploadResult }>> => {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Файл не выбран" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Файл должен быть изображением" },
        { status: 400 },
      );
    }

    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const extension = path.extname(file.name).toLowerCase();

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        {
          success: false,
          message: "Недопустимый формат файла. Разрешены: JPG, PNG, WebP",
        },
        { status: 400 },
      );
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);

    const filename = `temp_${timestamp}_${random}${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "temp");
    const filePath = path.join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    const url = `/temp/${filename}`;

    return NextResponse.json({
      success: true,
      message: "Временное изображение успешно загружено",
      data: {
        url,
        filename: filename,
        originalName: originalName,
        // fullOriginalName: file.name,
        // size: file.size,
      },
    });
  } catch (e) {
    console.error("Ошибка загрузки изображения:", e);
    return NextResponse.json(
      {
        success: false,
        message: e instanceof Error ? e.message : "Неизвестная ошибка",
      },
      { status: 500 },
    );
  }
};
