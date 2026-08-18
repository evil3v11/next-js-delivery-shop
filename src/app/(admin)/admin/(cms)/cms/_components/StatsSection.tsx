"use client";

import { useStatsValue } from "../_hooks/useStatsValue";
import { useSiteSettings } from "../_hooks/useSiteSettings";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";

import { stats } from "../_utils/stats";
import { getStatValue } from "../_utils/getStatValue";

import StatItem from "./StatItem";
import StatsSkeleton from "./StatsSkeleton";

const StatsSection = () => {
  const { categoriesCount, keywordsCount } = useStatsValue();
  const { isLoading: areSettingsLoading } = useSiteSettings();
  const { isLoading: areCategoriesLoading } = useArticleCategoriesStore();

  const isLoading = areSettingsLoading || areCategoriesLoading;

  if (isLoading) return <StatsSkeleton />;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Общая статистика
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            stat={stat}
            statValue={getStatValue(
              stat.title,
              String(categoriesCount),
              String(keywordsCount),
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
