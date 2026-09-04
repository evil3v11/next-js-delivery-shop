"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useArticleStore } from "@/store/articleStore";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import { transliterateText } from "@/utils/transliterateText";
import { ARTICLE_GENERATION_PROMPT } from "./_utils/textPrompt";
import { cleanGeneratedHtml } from "./_utils/cleanGeneratedHtml";
import {
  generateArticleImages,
  updateArticleWithImages,
} from "./_utils/imageGeneration";

import { GenerationStatus, UpdateArticleFormData } from "../_types";

import GenerationForm from "./_components/GenerationForm";
import ProcessInfo from "./_components/ProcessInfo";
import GenerationStatusPanel from "./_components/GenerationStatusPanel";
import ErrorMessage from "./_components/ErrorMessage";
import SuccessMessage from "./_components/SuccessMessage";

type GenerationStatusLocal = Exclude<GenerationStatus, "failed">;

const ArticlesGenerationPage = () => {
  const [topic, setTopic] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] =
    useState<GenerationStatusLocal>("idle");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentStep, setCurrentStep] = useState("1");
  const [currentStepName, setCurrentStepName] = useState(
    "Основное изображение",
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { categories, fetchArticleCategories } = useArticleCategoriesStore();
  const selectedCategory = categories.find((c) => c._id === categoryId);

  const { createArticle } = useArticleStore();

  const { user } = useAuthStore();
  const author = `${user?.lastName} ${user?.name}`.trim() ?? "Неизвестен";

  useEffect(() => {
    fetchArticleCategories({ unlimited: true });
  }, [fetchArticleCategories]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (generationStatus === "generating" || generationStatus === "loading") {
      timerRef.current = setInterval(
        () => setElapsedSeconds((prev) => prev + 1),
        1000,
      );
    } else if (generationStatus === "idle" || generationStatus === "success") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setElapsedSeconds(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [generationStatus]);

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId);
    if (category) {
      setCategoryId(category._id);
      setCategoryName(category.name);
      setCategorySlug(category.slug);
      setIsCategoryOpen(false);
    }
  };

  const generateImagesInBackground = useCallback(
    async (
      articleId: string,
      topic: string,
      articleData: UpdateArticleFormData,
    ) => {
      try {
        setGenerationStatus("generating");
        setCurrentStep("1");
        setCurrentStepName("Основное изображение");

        const images = await generateArticleImages(
          topic,
          articleData,
          (step: number, stepName: string) => {
            setGenerationStatus("loading");
            setCurrentStep(String(step));
            setCurrentStepName(stepName);
          },
        );

        setGenerationStatus("success");
        setCurrentStep("3");
        setCurrentStepName("Завершено");

        const { success } = await updateArticleWithImages(
          articleId,
          articleData,
          images,
          topic,
        );

        if (!success) {
          setError(
            "Статья была создана, но обновлени с изображениями не удалось",
          );
        }
      } catch (e) {
        console.error("Ошибка фоновой генерации изображений: ", e);
        setGenerationStatus("error");
        setCurrentStepName("Ошибка");
      } finally {
        setTimeout(() => {
          window.location.href = `/blog/${articleData.categorySlug}/${articleData.slug}`;
        }, 3000);
      }
    },
    [],
  );

  const handleGenerateArticle = useCallback(async () => {
    if (!topic.trim()) {
      setError("Введите тему статьи");
      return;
    }
    if (!categoryId) {
      setError("Выберите категорию для статьи");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setSuccess(null);
      setGenerationStatus("generating");
      setElapsedSeconds(0);

      const prompt = ARTICLE_GENERATION_PROMPT(topic);
      const response = await fetch(
        "/admin/cms/api/articles/yandex-gpt/generate-text",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ prompt, action: "generate" }),
        },
      );

      const { success, message, data } = await response.json();
      if (!response.ok || !success) {
        setError(message);
        setGenerationStatus('error')
        setSuccess(null);
        setElapsedSeconds(0);
        return;
      }

      const content = cleanGeneratedHtml(data.text);
      const slug = transliterateText(topic, true);

      const stripHtmlTags = (html: string): string => html.replace(/<[^>]*>/g, '')
      const plainText = stripHtmlTags(content)

      const articleData: UpdateArticleFormData = {
        name: topic,
        slug,
        description: plainText.substring(0, 160),
        keywords: [],
        image: "",
        imageAlt: topic,
        author,
        categoryId,
        categoryName,
        categorySlug,
        content,
        isFeatured: false,
        status: "published",
      };

      const createResult = await createArticle(articleData);
      if (!createResult.success || !createResult.data?._id) {
        setError(createResult.message);
        return;
      }

      setSuccess(`Статья "${topic} успешно создана, генерирую изображения..."`);

      const articleId = createResult.data._id;
      const fullArticleData: UpdateArticleFormData = {
        ...articleData,
        _id: articleId,
        content: content || "",
        categoryId,
        categoryName,
        categorySlug,
      };

      await generateImagesInBackground(articleId, topic, fullArticleData);
      setGenerationStatus("idle");
    } catch (e) {
      console.error("Ошибка при генерации или сохранении статьи: ", e);
      setError(e instanceof Error ? e.message : "Неизвестная ошибка генерации");
      setGenerationStatus("error");
    } finally {
      setIsGenerating(false);
      setGenerationStatus('idle')
    }
  }, [
    author,
    categoryId,
    categoryName,
    categorySlug,
    createArticle,
    generateImagesInBackground,
    topic,
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Автогенерация статей
        </h1>
        <p className="text-gray-600 mt-2">
          Генерация и автоматическое сохранение статей с изображениями
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        {error && <ErrorMessage error={error} />}
        {success && <SuccessMessage success={success} />}
        {generationStatus !== "idle" && (
          <GenerationStatusPanel
            status={generationStatus}
            elapsedSeconds={elapsedSeconds}
            currentStep={currentStep}
            totalSteps="3"
            currentStepName={currentStepName}
          />
        )}
        <GenerationForm
          topic={topic}
          categorySlug={categorySlug}
          isCategoryOpen={isCategoryOpen}
          isGenerating={isGenerating}
          selectedCategoryId={categoryId}
          selectedCategorySlug={selectedCategory?.slug}
          onTopicChange={setTopic}
          onCategorySelect={handleCategorySelect}
          onToggleCategoryOpen={() => setIsCategoryOpen(!isCategoryOpen)}
          onGenerate={handleGenerateArticle}
        />
        <ProcessInfo />
      </div>
    </div>
  );
};

export default ArticlesGenerationPage;
