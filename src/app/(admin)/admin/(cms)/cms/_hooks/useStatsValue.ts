import { useEffect, useState } from "react";
import { useSiteSettings } from "./useSiteSettings";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

export const useStatsValue = () => {
  const [publishedCount, setPublishedCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);

  const { settings } = useSiteSettings();
  const { totalAllItems, fetchArticleCategories } = useArticleCategoriesStore();
  const keywordsCount = settings?.semanticCore.length || 0;

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await fetchArticleCategories();
        const response = await fetch("/admin/cms/api/stats");
        if (!response.ok) throw new Error("Ошибка загрузка статистики");

        const data = await response.json();
        setPublishedCount(data.publishedCount || 0);
        setViewsCount(data.totalViews || 0);
      } catch (e) {
        console.error("Ошибка загрузка статистики: ", e);
      }
    };

    loadAllData();
  }, [fetchArticleCategories]);

  return {
    categoriesCount: totalAllItems,
    keywordsCount,
    publishedCount,
    viewsCount,
  };
};
