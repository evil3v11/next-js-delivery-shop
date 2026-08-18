"use client";

import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

const CategoryResultStats = () => {
  const { totalFilteredItems, totalAllItems, searchQuery } = useArticleCategoriesStore();
  return (
    <div className="mt-3 text-sm text-gray-500">
      Найдено: <span className="font-medium">{totalFilteredItems}</span> из{" "}
      <span className="font-medium">{totalAllItems}</span> категорий
      {searchQuery && (
        <span className="ml-4">
          По запросу: &quot;<span className="font-medium">{searchQuery}</span>
          &quot;
        </span>
      )}
    </div>
  );
};

export default CategoryResultStats;
