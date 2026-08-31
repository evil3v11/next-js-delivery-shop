"use client";

import { useEffect, useState } from "react";
import { useArticleFormState } from "../../_hooks/useArticleFormState";
import { useArticlesCRUD } from "../../_hooks/useArticlesCRUD";

import { ARTICLE_SEO_RECOMMENDATIONS } from "../../../_utils/recommendations";

import { ChevronUp } from "lucide-react";
import SEORecommendations from "../../../_components/SEORecommendations";
import CMSHeader from "../../../_components/CMSHeader";
import Notification from "../../../_components/Notification";
import ArticleForm from "./ArticleForm";

const ArticleEditorPageContentWrapper = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const {
    generateSlug,
    saveImageFile,
    removeImage,
    resetForm,
    uploadImageToServer,
  } = useArticleFormState();

  const { notification, setNotification, handleCreateArticle } =
    useArticlesCRUD(uploadImageToServer);

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 1, behavior: "smooth" });

  return (
    <>
      <CMSHeader title="Текстовый редактор" description="Создание статей" />
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <ArticleForm
        onGenerateSlug={generateSlug}
        onSaveImageFile={saveImageFile}
        onRemoveImage={removeImage}
        onSubmit={handleCreateArticle}
        onCancel={resetForm}
      />
      <SEORecommendations recommendations={ARTICLE_SEO_RECOMMENDATIONS} />
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          title="К началу страницы"
          className="fixed bottom-8 right-8 z-50 p-3 bg-primary text-white rounded-full cursor-pointer"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default ArticleEditorPageContentWrapper;
