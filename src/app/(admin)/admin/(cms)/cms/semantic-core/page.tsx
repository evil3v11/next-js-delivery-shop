"use client";

import { useSiteSettings } from "../_hooks/useSiteSettings";

import { Loader, Loader2 } from "lucide-react";
import Header from "../_components/CMSHeader";
import SEOForm from "./_components/SEOForm";
import SEORecommendations from "../_components/SEORecommendations";
import { COMMON_SEO_RECOMMENDATIONS } from "../_utils/recommendations";

const SemanticCorePage = () => {
  const { settings, isLoading, isSaving, formData, setFormData, handleSave } = useSiteSettings();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {isSaving && (
        <div className="fixed top-4 right-4 z-50">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-md">
            <Loader2 className="animate-spin h-4 w-4" />
            <span className="text-sm">Сохранение...</span>
          </div>
        </div>
      )}
      <Header
        title="SEO настройки сайта"
        description="Настройки ключевых слов и семантического ядра для всего сайта"
      />
      <SEOForm
        formData={formData}
        setFormData={setFormData}
        settings={settings}
        isSaving={isSaving}
        handleSave={handleSave}
      />
      <SEORecommendations recommendations={COMMON_SEO_RECOMMENDATIONS} />
    </>
  );
};

export default SemanticCorePage;
