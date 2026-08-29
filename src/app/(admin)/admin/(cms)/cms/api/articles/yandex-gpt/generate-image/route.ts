import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

import { NextRequest, NextResponse } from "next/server";
import {
  GenerationRequestData,
  YandexArtImageGenerationRequestBody,
  ImageStyle,
  YandexArtImageGenerationResponse,
  OperationStatus,
  YandexArtPollResponse,
} from "../../../../articles/_types";

const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;
const YANDEX_IMAGE_API_KEY = process.env.YANDEX_IMAGE_API_KEY;

export const GET = async (
  request: NextRequest,
): Promise<NextResponse<YandexArtPollResponse>> => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const operationId = searchParams.get("operationId");
    if (!operationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Нет ID операции",
          status: "error",
        },
        { status: 400 },
      );
    }

    if (!YANDEX_FOLDER_ID || YANDEX_IMAGE_API_KEY) {
      console.error("API keys were not found: ", {
        hasImageApiKey: !!YANDEX_IMAGE_API_KEY,
        hasFolderId: !!YANDEX_FOLDER_ID,
      });

      return NextResponse.json(
        {
          success: false,
          message: "No API keys were found, access denied",
          status: "error",
        },
        { status: 500 },
      );
    }

    const statusUrl = `https://operation.api.cloud.yandex.net/operations/${operationId}`;

    const pollResponse = await fetch(statusUrl, {
      headers: {
        Authorization: `Api-Key ${YANDEX_IMAGE_API_KEY}`,
        Accept: "application/json",
      },
    });

    const responseText = await pollResponse.text();
    if (!pollResponse.ok) {
      console.error(
        "Не удалось получить статус: ",
        responseText.substring(0, 200),
      );
      return NextResponse.json(
        {
          success: false,
          message: "Ошибка при проверки статуса",
          details: responseText.substring(0, 500),
          status: "error",
        },
        { status: pollResponse.status },
      );
    }

    let pollData: OperationStatus;

    try {
      pollData = JSON.parse(responseText);
    } catch (e) {
      console.error("Unable to parse response data: ", e);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON response from YandexArt API",
          details: responseText.substring(0, 500),
          status: "error",
        },
        { status: 500 },
      );
    }

    if (pollData.done) {
      if (pollData.response?.image) {
        const base64Image = pollData.response.image;
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data);

        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);

        const originalExtension = "png";
        const cleanName = "yandex_art";
        const fileName = `${cleanName}_${timestamp}_${randomString}.${originalExtension}`;

        let optimizedBuffer: Buffer;

        if (originalExtension === "png") {
          optimizedBuffer = await sharp(buffer)
            .resize(2048, 2048, {
              fit: "inside",
              withoutEnlargement: false,
            })
            .png({ quality: 90, compressionLevel: 8 })
            .toBuffer();
        } else {
          optimizedBuffer = await sharp(buffer)
            .resize(2048, 2048, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({ quality: 90, mozjpeg: true })
            .toBuffer();
        }

        const publicDir = path.join(
          process.cwd(),
          "public",
          "uploads",
          "aricles",
          "yandex-art",
        );

        await fs.mkdir(publicDir, { recursive: true });

        const filePath = path.join(publicDir, fileName);
        await fs.writeFile(filePath, optimizedBuffer);

        const publicUrl = `/uploads/articles/yandex-art/${fileName}`;

        return NextResponse.json({
          success: true,
          message: "Изображение успешно сгенерировано",
          status: "success",
          imageUrl: publicUrl,
          fileName,
          fileSize: optimizedBuffer.length,
          format: originalExtension,
          operationId,
        });
      } else if (pollData.error) {
        console.error("Ошибка генерации статуса: ", pollData.error);
        return NextResponse.json({
          success: false,
          done: true,
          status: "failed",
          message: pollData.error,
          operationId: operationId,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Неизвестный ответ от YandexArt API",
          done: true,
          status: "error",
          operationId: operationId,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Генерация все еще выполняется",
      done: false,
      status: "loading",
      operationId: operationId,
    });
  } catch (e) {
    console.error("Ошибка проверки статуса:", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка проверки",
        details: errorMessage,
        status: "error",
      },
      { status: 500 },
    );
  }
};

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<YandexArtImageGenerationResponse>> => {
  try {
    const {
      prompt,
      aspect_ratio = "1:1",
      style = "default",
    } = (await request.json()) as GenerationRequestData;

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Описание должно содержать минимум 3 символа",
        },
        { status: 400 },
      );
    }

    if (!YANDEX_FOLDER_ID || !YANDEX_IMAGE_API_KEY) {
      console.error("API keys were not found: ", {
        hasImageApiKey: !!YANDEX_IMAGE_API_KEY,
        hasFolderId: !!YANDEX_FOLDER_ID,
      });

      return NextResponse.json(
        {
          success: false,
          message: "No API keys were found, access denied",
        },
        { status: 500 },
      );
    }

    let [width, height] = aspect_ratio.split(":").map(Number);

    switch (aspect_ratio) {
      case "16:9":
        width = 16;
        height = 9;
        break;
      case "16:10":
        width = 16;
        height = 10;
        break;
      case "21:9":
        width = 21;
        height = 9;
        break;
    }

    let enhancedPrompt = prompt;
    const styleMap: Record<ImageStyle, string> = {
      default: "",
      realistic: "фотореалистично, высокое качество, детализированно, профессиональная фотография",
      artistic: "художественная живопись, шедевр, цифровое искусство, арт",
      sketch: "эскиз, рисунок, карандашный набросок, черно-белое",
      cartoon: "мультяшный стиль, анимация, диснеевский стиль",
    };

    if (style !== "default" && styleMap[style])
      enhancedPrompt = `${styleMap[style]}: ${prompt}`;

    const requestBody: YandexArtImageGenerationRequestBody = {
      modelUri: `art://${YANDEX_FOLDER_ID}/yandex-art/latest`,
      messages: [{ text: enhancedPrompt, weight: 1 }],
      generationOptions: {
        mimeType: "image/png",
        seed: Math.floor(Math.random() * 1000000),
        aspectRatio: {
          widthRatio: width,
          heightRatio: height,
        },
      },
    };

    const response = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Api-Key ${YANDEX_IMAGE_API_KEY}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Ошибка YandexArt API",
          details: `${response.status === 403 ? 'Запрещено' : response.status}`,
        },
        { status: response.status },
      );
    }

    if (!responseText || !responseText.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Пустой ответ от YandexArt API",
        },
        { status: 500 },
      );
    }

    let generatedData: YandexArtImageGenerationResponse;

    try {
      generatedData = JSON.parse(responseText);
    } catch (e) {
      console.error("Unable to parse response data: ", e);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON response from YandexArt API",
          details: responseText.substring(0, 500),
        },
        { status: 500 },
      );
    }

    const operationId = generatedData.operationId;
    if (!operationId) {
      console.error(
        "operationId was not found in response data: ",
        generatedData,
      );
      return NextResponse.json(
        {
          success: false,
          message: "ID операции не найден",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        operationId: operationId,
        status: "loading",
        message: "Генерация изображения начата",
        style: style,
        aspect_ratio: aspect_ratio,
        widthRatio: width,
        heightRatio: height,
        api_format: "aspectRatio_object",
      },
      { status: 201 },
    );
  } catch (e) {
    console.error("Generation error:", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { success: false, message: "Внутренняя ошибка", details: errorMessage },
      { status: 500 },
    );
  }
};
