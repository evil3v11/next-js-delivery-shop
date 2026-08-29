import { Activity, useEffect, useRef, useState } from "react";

import { formatAIResponse } from "../../_utils/formatAIResponse";
import {
  createApiError,
  getErrorMessage,
  getFullErrorMessage,
  isErrorWithStatusCode,
} from "../../_utils/errorUtils";

import {
  AIStatus,
  EditorProps,
  QuickAction,
  YandexGPTResponse,
} from "../../../_types";

import { Brain } from "lucide-react";
import TextAIMenuModal from "./TextAIMenuModal";

const TextAIMenu = ({ editor }: EditorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAITextModal, setShowAITextModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiStatus, setAiStatus] = useState<AIStatus>("idle");
  const [errorDetails, setErrorDetails] = useState<string>("");

  const aiStatusTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (aiStatusTimer.current) {
      clearTimeout(aiStatusTimer.current)
      aiStatusTimer.current = null
    }

    return () => {
      if (aiStatusTimer.current) clearTimeout(aiStatusTimer.current);
    };
  }, []);

  const getSelectedText = (): string => {
    if (!editor || editor?.state.selection.empty) return "";

    return editor?.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      "",
    );
  };

  const selectedText = getSelectedText();

  const generateWithYandexGPT = async (
    action: QuickAction,
    promptText?: string,
  ) => {
    if (!editor) return;

    try {
      setIsGenerating(true);
      setAiStatus("loading");
      setErrorDetails("");

      const selectedText = getSelectedText();

      let prompt = "";
      if (promptText?.trim()) {
        prompt = customPrompt.trim();
      } else if (selectedText.trim()) {
        prompt = selectedText.trim();
      } else {
        setAiStatus("error");
        setErrorDetails("Выделите текст или введите запрос");
        return;
      }

      const response = await fetch(
        "/admin/cms/api/articles/yandex-gpt/generate-text",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ prompt, action }),
        },
      );

      const { success, message, data } =
        (await response.json()) as YandexGPTResponse;

      if (!success) {
        setErrorDetails(message);
        createApiError(message);
      }

      if (!data?.text) throw new Error("Пустой ответ от YandexGPT");

      const formattedText = formatAIResponse(data.text);

      if (!editor.state.selection.empty) {
        editor
          .chain()
          .focus()
          .deleteSelection()
          .insertContent(formattedText, {
            parseOptions: { preserveWhitespace: "full" },
          })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent("\n\n" + formattedText + "\n\n", {
            parseOptions: { preserveWhitespace: "full" },
          })
          .run();
      }

      setAiStatus("success");
      setCustomPrompt("");
      setShowAITextModal(false);
    } catch (e: unknown) {
      setAiStatus("error");
      console.error("YandexGPT error: ", e);

      if (isErrorWithStatusCode(e)) {
        setErrorDetails(getErrorMessage(e.statusCode));
        if (e.statusCode && e.statusCode >= 500) alert(getFullErrorMessage(e));
      } else if (e instanceof Error) {
        setErrorDetails(e.message);
      } else {
        setErrorDetails("Unknown error");
      }
    } finally {
      setIsGenerating(false);
      aiStatusTimer.current = setTimeout(() => setAiStatus("idle"), 2000);
    }
  };

  const handleQuickAction = (actionId: QuickAction) =>
    generateWithYandexGPT(actionId);

  const handleCloseModal = () => {
    setShowAITextModal(false);
    setAiStatus("idle");
    setErrorDetails("");
  };

  const handleCustomPrompt = () => {
    if (customPrompt.trim()) {
      generateWithYandexGPT("custom", customPrompt);
    } else {
      setAiStatus("error");
      setErrorDetails("Введите запрос для YandexGPT");
      aiStatusTimer.current = setTimeout(() => setAiStatus("idle"), 2000);
    }
  };

  const testYandexAPI = async () => {
    try {
      setIsGenerating(true);
      setAiStatus("loading");

      const response = await fetch(
        "/admin/cms/api/articles/yandex-gpt/generate-text",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt:
              "Привет! Это тестовый запрос. Ответь коротко, работает ли API.",
            action: "custom",
          }),
        },
      );

      const { success, data, details } =
        (await response.json()) as YandexGPTResponse;

      if (response.ok && success) {
        setAiStatus("success");
        alert(
          `YandexGPT API работает!\n\nОтвет: ${data?.text}\n\nМодель: ${data?.model || "yandexgpt"}`,
        );
      } else {
        throw createApiError(details || "Unknown error", response.status);
      }
    } catch (e: unknown) {
      setAiStatus("error");
      console.error("YandexGPT error: ", e);

      if (isErrorWithStatusCode(e)) {
        alert(getFullErrorMessage(e));
      } else if (e instanceof Error) {
        alert(`Ошибка подключения: ${e.message}`);
      } else {
        alert("Неизвестная ошибка подключения");
        aiStatusTimer.current = setTimeout(() => setAiStatus("idle"), 2000);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!editor) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowAITextModal(true)}
        title="Открыть AI помощник (YandexGPT)"
        className="px-3 py-1.5 rounded-md bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 
        hover:to-pink-600 text-white shadow-sm shadow-purple-500/20 hover:shadow-md hover:shadow-purple-500/30 
        cursor-pointer duration-300 flex items-center gap-2 h-8 text-xs"
      >
        <Brain className="w-3.5 h-3.5" />
        <span>ИИ Текст</span>
      </button>
      <Activity mode={showAITextModal ? "visible" : "hidden"}>
        <TextAIMenuModal
          isGenerating={isGenerating}
          onClose={handleCloseModal}
          aiStatus={aiStatus}
          selectedText={selectedText}
          prompt={customPrompt}
          onPromptChange={setCustomPrompt}
          onQuickAction={handleQuickAction}
          errorDetails={errorDetails}
          onCustomPropmtAction={handleCustomPrompt}
          onTestAPIAction={testYandexAPI}
        />
      </Activity>
    </div>
  );
};

export default TextAIMenu;
