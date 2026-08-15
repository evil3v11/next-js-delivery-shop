import { useEffect, useState } from "react";

import { FormData, SiteSettings } from "../_types/siteSettings";
import { UseSiteSettingsResult } from "../_types/hooks";

export const useSiteSettings = (): UseSiteSettingsResult => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    siteTitle: "",
    metaDescription: "",
    siteKeywords: "",
    semanticCore: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings(): Promise<void> {
    try {
      setIsLoading(true);
      const response = await fetch("/admin/cms/api/site-settings");
      const { success, data } = await response.json();

      if (success) {
        setSettings(data);
        setFormData({
          siteTitle: data.siteTitle || "",
          metaDescription: data.metaDescription || "",
          siteKeywords: (data.siteKeywords || []).join(", "),
          semanticCore: (data.semanticCore || []).join(", "),
        });
      }
    } catch (e) {
      console.error("Ошибка загрузки настроек CMS: ", e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const response = await fetch("/admin/cms/api/site-settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...formData,
          siteKeywords: formData.siteKeywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0),
          semanticCore: formData.semanticCore
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0),
        }),
      });
      const { success } = await response.json();

      if (success) {
        alert("Настроки сохранены");
        await loadSettings();
      }
    } catch (e) {
      console.error("Ошибка сохранения настроек CMS: ", e);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    formData,
    setFormData,
    loadSettings,
    handleSave,
  };
};
