"use client";

import { useArticleFormState } from "../../_hooks/useArticleFormState";
import { useArticlesCRUD } from "../../_hooks/useArticlesCRUD";

import { ARTICLE_SEO_RECOMMENDATIONS } from "../../../_utils/recommendations";

import SEORecommendations from "../../../_components/SEORecommendations";
import CMSHeader from "../../../_components/CMSHeader";
import Notification from "../../../_components/Notification";
import ArticleForm from "./ArticleForm";

const ArticleEditorPageContentWrapper = () => {
  const {
    generateSlug,
    saveImageFile,
    removeImage,
    resetForm,
    uploadImageToServer,
  } = useArticleFormState();

  const { notification, setNotification, handleCreateArticle } = useArticlesCRUD(uploadImageToServer);

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
    </>
  );
};

export default ArticleEditorPageContentWrapper;
