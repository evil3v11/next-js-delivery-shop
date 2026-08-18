"use client";

import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

const EmptyState = () => {
  const { searchQuery } = useArticleCategoriesStore();
  return (
    <div className="p-8 text-center text-gray-500">
      {searchQuery
        ? `Ничего не найдено по запросу "${searchQuery}"`
        : "Категорий пока нет"}
    </div>
  );
};

export default EmptyState;
