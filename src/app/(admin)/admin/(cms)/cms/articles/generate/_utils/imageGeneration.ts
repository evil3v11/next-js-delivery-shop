import { ApiResponse } from "@/types/api/default-response";
import {
  AspectRatio,
  GenerationRequestData,
  UpdateArticleFormData,
} from "../../_types";
import { ImageGenerationResult, ProgressCallback } from "../_types";
import { insertImagesIntoArticle } from "./insertImagesIntoArticle";

export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      "/admin/cms/api/articles/yandex-gpt/generate-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          prompt: "Test connection: simple geometry shape",
          aspect_ratio: "1:1",
          style: "photo",
        }),
      },
    );

    if (!response.ok) return false;

    const data = await response.json();
    return !!data.operationId;
  } catch (e) {
    console.error("API недоступно: ", e);
    return false;
  }
};

export const pollImageGeneration = async (
  operationId: string,
  maxAttempts = 30,
): Promise<string> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `/admin/cms/api/articles/yandex-gpt/generate-image?operationId=${operationId}`,
      );

      const { success, message, imageUrl } = await response.json();
      if (!response.ok || !success) {
        console.error(message);
        throw new Error(message);
      }

      if (success && imageUrl) return imageUrl;
      await new Promise((res) => setTimeout(res, 3000));
    } catch (e) {
      if (attempt === maxAttempts) throw e;
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  throw new Error("Превышено время ожидания генерации");
};

export const generateSingleImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
): Promise<string> => {
  try {
    const request: GenerationRequestData = {
      prompt,
      aspect_ratio: aspectRatio,
      style: "realistic",
    };

    const response = await fetch(
      "/admin/cms/api/article/yandex-gpt/generate-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(request),
      },
    );

    const { success, message, data } = await response.json();
    if (!response.ok || !success) throw new Error(message);
    if (!data.operationId) throw new Error(message || "Нет ID операции");

    return await pollImageGeneration(data.operationId);
  } catch (e) {
    console.error("Ошибка при генерации изображения: ", e);
    throw e;
  }
};

export const generateArticleImages = async (
  topic: string,
  articleData: UpdateArticleFormData,
  onProgress?: ProgressCallback,
): Promise<ImageGenerationResult> => {
  if (!articleData.content)
    throw new Error("Отсутствуют данные для генерации изображений");

  const apiAvailable = await testApiConnection();
  if (!apiAvailable) throw new Error("API генерации изображений недоступно");

  try {
    const imgPrompts = {
      main: `Высококачественное профессиональное фото для статьи "${topic}". Редакционный стиль, отличное освещение, резкий фокус, реалистичность, соотношение сторон 16:10.`,
      middle: `Фотореалистичная визуализация для статьи о "${topic}". Концептуальное фото, информативное, детализированное, квадратный формат, профессиональная фотография.`,
      end: `Фотореалистичное заключительное изображение для статьи о "${topic}". Эпичная фотография, широкая панорама, кинематографический формат, эффектная композиция.`,
    };

    if (onProgress) onProgress(1, "Основное изображение");
    const mainImageUrl = await generateSingleImage(imgPrompts.main, "16:10");

    if (onProgress) onProgress(2, "Среднее изображение");
    const middleImageUrl = await generateSingleImage(imgPrompts.middle, "1:1");

    if (onProgress) onProgress(3, "Финальное изображение");
    const endImageUrl = await generateSingleImage(imgPrompts.end, "21:9");

    return {
      mainImageUrl,
      middleImageUrl,
      endImageUrl,
    };
  } catch (e) {
    console.error("Ошибка в процессе генерации изображений: ", e);
    throw new Error(
      `Не удалось сгенерировать изображения: ${e instanceof Error ? e.message : "Неизвестная ошибка генерации"}`,
    );
  }
};

export const updateArticleWithImages = async (
  articleId: string,
  articleData: UpdateArticleFormData,
  images: ImageGenerationResult,
  topic: string,
): Promise<ApiResponse> => {
  try {
    const { contentWithImages, imageAlt } = insertImagesIntoArticle(
      articleData.content,
      images,
      topic,
    );

    const updateData = {
      ...articleData,
      _id: articleId,
      content: contentWithImages,
      image: images.mainImageUrl,
      imageAlt,
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch("/admin/cms/api/articles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(updateData),
    });

    return await response.json();
  } catch (e) {
    console.error("Ошибка при обновлении статьи: ", e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Ошибка при обновлении статьи",
    };
  }
};
