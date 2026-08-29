import { Activity, useCallback, useEffect, useRef, useState } from "react";

import {
  EditorProps,
  AspectRatio,
  Generation,
  ImageStyle,
  GenerationRequestData,
  YandexArtImageGenerationResponse,
} from "../../../_types";

import { ImageIcon } from "lucide-react";
import ImageAIMenuModal from "./ImageAIMenuModal";

const ImageAIMenu = ({ editor }: EditorProps) => {
  const [showAiImageModal, setShowAiImageModal] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generation, setGeneration] = useState<Generation>({ status: "idle" });
  const [selectedAspect, setSelectedAspect] = useState<AspectRatio>("1:1");
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>("default");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [apiInfo, setApiInfo] = useState<string>("");

  const aiStatusTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (aiStatusTimer.current) {
      clearInterval(aiStatusTimer.current);
      aiStatusTimer.current = null;
    }

    if (generation.status == "generating" || generation.status === "loading") {
      aiStatusTimer.current = setInterval(
        () => setElapsedSeconds((prev) => prev + 1),
        1000,
      );
    } else if (generation.status === "idle") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setElapsedSeconds(0);
    }

    return () => {
      if (aiStatusTimer.current) clearInterval(aiStatusTimer.current);
    };
  }, [generation.status]);

  useEffect(() => {
    if (generation.status !== "loading" || !generation.operationId) return;

    let timer: NodeJS.Timeout | null = null;
    let isMounted = true;

    const pollForStatus = async () => {
      if (!isMounted) return;
      try {
        const pollResponse = await fetch(
          `/admin/cms/api/articles/yandex-gpt/image?operationId=${generation.operationId}`,
        );

        const { done, imageUrl, error } = await pollResponse.json();

        if (done) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }

          if (imageUrl) {
            setGeneration({
              status: "success",
              operationId: generation.operationId,
              imageUrl,
            });
          } else if (error) {
            setGeneration({
              status: "error",
              operationId: generation.operationId,
              error: error,
            });
          }
        } else {
          if (isMounted) {
            timer = setTimeout(pollForStatus, 3000);
          }
        }
      } catch (e) {
        console.error("Status polling failed: ", e);
        if (isMounted) {
          setGeneration({
            status: "error",
            operationId: generation.operationId,
            error: "Ошибка при опросе статуса",
          });
        }
      }
    };

    pollForStatus();
    timer = setTimeout(pollForStatus, 3000);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [generation.status, generation.operationId]);

  const callYandexAPI = useCallback(
    async (
      requestData: GenerationRequestData,
    ): Promise<YandexArtImageGenerationResponse> => {
      const response = await fetch(
        "/admin/cms/api/articles/yandex-gpt/generate-image",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(requestData),
        },
      );

      return await response.json();
    },
    [],
  );

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) {
      alert("Введите описание изображения");
      return;
    }

    try {
      setGeneration({ status: "generating" });
      setApiInfo("");

      const { success, operationId, message } = await callYandexAPI({
        prompt,
        aspect_ratio: selectedAspect,
        style: selectedStyle,
      });

      if (!success) throw new Error(message || "Ошибка генерации изображения");

      if (operationId) {
        setGeneration({ status: "loading", operationId });
        setApiInfo(
          `Запрос принят. ID запроса: ${operationId.substring(0, 20)}...`,
        );
      } else throw new Error("Не получен ID операции");
    } catch (e) {
      const eMessage =
        e instanceof Error ? e.message : "Неизвестная ошибка генерации";
      setGeneration({ status: "error", error: eMessage });
      alert(`Ошибка YandexGPT: ${eMessage}`);
    }
  }, [callYandexAPI, prompt, selectedAspect, selectedStyle]);

  const handleTestApi = useCallback(async () => {
    try {
      const { success, operationId, message, details, model } =
        await callYandexAPI({
          prompt: "Тестовая генерация",
          aspect_ratio: "1:1",
          style: "default",
        });

      if (success && operationId) {
        setApiInfo(
          `YandexGPT успешно работает. ID: ${operationId}\nМодель: ${model || "yandex-art"}`,
        );
        alert(
          `YandexGPT успешно работает. ID: ${operationId}\nМодель: ${model || "yandex-art"}`,
        );
      } else {
        setApiInfo(
          `Ошибка: ${details || message || "Ошибка тестирования генерации"}`,
        );
        alert(
          `Ошибка: ${details || message || "Ошибка тестирования генерации"}`,
        );
      }
    } catch (e) {
      const eMessage =
        e instanceof Error ? e.message : "Неизвестная ошибка генерации";
      setGeneration({ status: "error", error: eMessage });
      alert(`Ошибка YandexGPT: ${eMessage}`);
    }
  }, [callYandexAPI]);

  const closeModal = useCallback(() => {
    setShowAiImageModal(false);
    setPrompt("");
    setGeneration({ status: "idle" });
    setSelectedStyle("default");
    setElapsedSeconds(0);
    setApiInfo("");
  }, []);

  const handleAspectChange = useCallback(
    (aspect: AspectRatio) => setSelectedAspect(aspect),
    [],
  );
  const handleStyleChange = useCallback(
    (style: ImageStyle) => setSelectedStyle(style),
    [],
  );
  const handlePromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value),
    [],
  );

  const handleDownload = useCallback(() => {
    if (!generation.imageUrl) return;

    const link = document.createElement("a");
    link.href = generation.imageUrl;
    link.download = `yandex-art-${Date.now()}.png`;
    document.appendChild(link);
    link.click();
    document.removeChild(link);
  }, [generation.imageUrl]);

  const handleInsertInEditor = useCallback(() => {
    if (generation.imageUrl && editor) {
      editor
        .chain()
        .focus()
        .setImage({
          src: generation.imageUrl,
          alt: prompt,
          title: `Сгенерировано YandexGPT: ${prompt}`,
        })
        .run();

      closeModal();
    }
  }, [generation.imageUrl, editor, prompt, closeModal]);

  const handleGenerateImage = useCallback(
    async () => await generateImage(),
    [generateImage],
  );

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        title="Сгенерировать изображение с помощью ИИ"
        onClick={() => setShowAiImageModal(true)}
        className="px-3 py-1.5 rounded-md bg-linear-to-r from-cyan-500 to-blue-700 hover:from-cyan-600 
        hover:to-blue-800 text-white shadow-sm shadow-cyan-500/20 hover:shadow-md hover:shadow-cyan-500/30 
        cursor-pointer duration-200 flex items-center gap-2 min-w-21.25 h-8 text-xs"
      >
        <ImageIcon className="w-3.5 h-3.5" />
        <span>ИИ Изо</span>
      </button>
      <Activity mode={showAiImageModal ? "visible" : "hidden"}>
        <ImageAIMenuModal
          prompt={prompt}
          generation={generation}
          selectedAspect={selectedAspect}
          selectedStyle={selectedStyle}
          elapsedSeconds={elapsedSeconds}
          apiInfo={apiInfo}
          onCloseClick={closeModal}
          onPromptChange={handlePromptChange}
          onAspectChange={handleAspectChange}
          onStyleChange={handleStyleChange}
          onDownload={handleDownload}
          onInsertInEditor={handleInsertInEditor}
          onGenerateImage={handleGenerateImage}
          onTestApi={handleTestApi}
        />
      </Activity>
    </div>
  );
};

export default ImageAIMenu;
