import { useEffect } from "react";
import { useSiteSettings } from "./useSiteSettings";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

export const useStatsValue = () => {
  const { settings } = useSiteSettings();
  const { totalAllItems, fetchArticleCategories } = useArticleCategoriesStore();
  const keywordsCount = settings?.semanticCore.length || 0;

  useEffect(() => {
    fetchArticleCategories()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    categoriesCount: totalAllItems,
    keywordsCount,
    publishedCount: 0,
    viewsCount: 0,
  };
};
