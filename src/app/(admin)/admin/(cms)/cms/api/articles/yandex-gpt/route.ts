import { NextRequest, NextResponse } from "next/server";
import {
  YandexGPTRequest,
  YandexGPTResponse,
  YandexGPTApiResponse,
} from "../../../articles/_types";
import { getSystemPrompt } from "../../../articles/_utils/systemPrompts";

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<YandexGPTResponse>> => {
  try {
    const { prompt, action = "improve" } =
      (await request.json()) as YandexGPTRequest;

    const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
    const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;

    if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
      return NextResponse.json(
        {
          success: false,
          message: "YandexGPT API не настроен",
          details: "Проверьте YANDEX_API_KEY и YANDEX_FOLDER_ID в .env.local",
        },
        { status: 500 },
      );
    }

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Неверный запрос",
          details: "Текст (prompt) обязателен",
        },
        { status: 400 },
      );
    }

    const systemPrompt = getSystemPrompt(action);

    const apiUrl =
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Api-Key ${YANDEX_API_KEY}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        modelUri: `gpt://${YANDEX_FOLDER_ID}/yandexgpt`,
        completionOptions: {
          stream: false,
          temperature: 0.7,
          maxTokens: 2000,
        },
        messages: [
          { role: "system", text: systemPrompt },
          { role: "user", text: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const data = await response.json();

      console.error(`${data.error.message}, status code: ${response.status}`);

      return NextResponse.json(
        {
          success: false,
          message: "Ошибка YandexGPT API",
          details: `${data.error.message}, status code: ${response.status}`,
        },
        { status: response.status },
      );
    }

    const data: YandexGPTApiResponse = await response.json();

    const generatedText = data.result?.alternatives?.[0].message?.text || "";

    if (!generatedText) {
      return NextResponse.json(
        {
          success: false,
          message: "Пустой ответ от YandexGPT",
          details: "API вернул пустой текст",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Текст для статьи успешно сгенерирован",
        data: {
          text: generatedText,
          model: "yandexgpt",
        },
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : "Unknown API error";
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        details: error,
      },
      { status: 500 },
    );
  }
};
