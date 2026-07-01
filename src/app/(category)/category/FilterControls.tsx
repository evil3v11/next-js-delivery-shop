"use client";

import { useSearchParams } from "next/navigation";

import { FilterControlsProps } from "@/types/filterControlsProps";

import Link from "next/link";
import Image from "next/image";

const FilterControls = ({ basePath }: FilterControlsProps) => {
  const searchParams = useSearchParams();
  const minPrice = searchParams.get("priceFrom");
  const maxPrice = searchParams.get("priceTo");
  const page = searchParams.get("page");
  const itemsPerPage = searchParams.get("itemsPerPage");
  const activeFilters = searchParams.getAll("filter");

  const buildClearFiltersLink = () => {
    const params = new URLSearchParams();

    if (page) params.set("page", page || "");
    if (itemsPerPage) params.set("itemsPerPage", itemsPerPage || "");

    params.delete("filter");
    params.delete("priceFrom");
    params.delete("priceTo");

    return `${basePath}?${String(params)}`;
  };

  const hasPriceFilter = minPrice || maxPrice;

  const buildClearPriceFilterLink = () => {
    const params = new URLSearchParams(String(searchParams));

    params.delete("priceFrom");
    params.delete("priceTo");

    return `${basePath}?${String(params)}`;
  };

  const activeFilterCount =
    (activeFilters
      ? Array.isArray(activeFilters)
        ? activeFilters.length
        : 1
      : 0) + (hasPriceFilter ? 1 : 0);

  const filterButtonText =
    activeFilterCount === 0
      ? "Фильтры"
      : activeFilterCount === 1
        ? "Фильтр 1"
        : `Фильтры ${activeFilterCount}`;

  return (
    <div className="flex flex-wrap gap-4">
      <div
        className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300
          cursor-not-allowed gap-x-2 xl:ml-3
          ${
            (activeFilters && activeFilters.length > 0) || hasPriceFilter
              ? "bg-primary text-white"
              : "bg-[#f3f2f1] text-[#606060]"
          }`}
      >
        {filterButtonText}
      </div>
      {hasPriceFilter && (
        <div
          className="h-8 p-2 rounded text-xs flex justify-center items-center duration-300
            gap-x-2 bg-primary text-white"
        >
          <Link
            href={buildClearPriceFilterLink()}
            className="flex items-center gap-x-2"
          >
            Цена {minPrice !== undefined ? `от ${minPrice}` : ""}{" "}
            {maxPrice !== undefined ? `от ${maxPrice}` : ""}
            <Image
              src={"/icons-products/icon-closer.svg"}
              alt="Очистить фильтр по цене"
              width={24}
              height={24}
              sizes="24px"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
        </div>
      )}

      {activeFilterCount > 0 && (
        <div
          className="h-8 p-2 rounded text-xs flex justify-center items-center duration-300 
          gap-x-2 bg-primary text-white"
        >
          <Link
            href={buildClearFiltersLink()}
            className="flex items-center gap-x-2"
          >
            Очистить фильтры
            <Image
              src={"/icons-products/icon-closer.svg"}
              alt="Очистить фильтры"
              width={24}
              height={24}
              sizes="24px"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
