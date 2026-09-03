"use client";

import { CMSResultsStats } from "@/types/props";

const CMSResultStats = ({
  type,
  totalFilteredItems,
  totalAllItems,
  searchQuery,
}: CMSResultsStats) => {
  return (
    <div className="mt-3 text-sm text-gray-500">
      Найдено: <span className="font-medium">{totalFilteredItems}</span> из{" "}
      <span className="font-medium">{totalAllItems}</span>{" "}
      {type === "categories" ? "категорий" : "статей"}
      {searchQuery && (
        <span className="ml-4">
          По запросу: &quot;<span className="font-medium">{searchQuery}</span>
          &quot;
        </span>
      )}
    </div>
  );
};

export default CMSResultStats;
