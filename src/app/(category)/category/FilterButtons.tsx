"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FILTERS = [
  { key: "our-production", label: "Товары нашего производства" },
  { key: "healthy-food", label: "Здоровое питание" },
  { key: "non-gmo", label: "Без ГМО" },
];

const FilterButtons = ({ basePath }: { basePath: string }) => {
  const searchParams = useSearchParams();
  const currentFilters = searchParams.getAll("filter");

  const buildFilterLink = (filterKey: string) => {
    const params = new URLSearchParams(searchParams);

    if (currentFilters.includes(filterKey)) {
      params.delete("filter");
      currentFilters
        .filter((f) => f !== filterKey)
        .forEach((f) => params.append("filter", f));
    } else {
      params.append("filter", filterKey);
    }

    params.delete("page");
    return `${basePath}?${String(params)}`;
  };

  const isFilterActive = (filterKey: string) => currentFilters.includes(filterKey);

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center">
      {FILTERS.map(({ key, label }) => (
        <Link
          key={key}
          href={buildFilterLink(key)}
          className={`h-8 p-2 text-xs flex justify-center items-center cursor-pointer rounded
            ${
              isFilterActive(key)
                ? "bg-primary text-white hover:shadow-button-default active:shadow-button-active"
                : "bg-[#f3f2f1] text-[#606060] hover:shadow-button-secondary active:shadow-button-active"
            }
          `}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default FilterButtons;
