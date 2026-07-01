import { FilterControlsProps } from "@/types/filterControlsProps";

import Link from "next/link";
import Image from "next/image";

const FilterControls = ({
  activeFilters,
  basePath,
  searchParams = {},
}: FilterControlsProps) => {
  const minPrice = searchParams.priceFrom;
  const maxPrice = searchParams.priceTo;

  const buildClearFiltersLink = () => {
    const params = new URLSearchParams();

    if (searchParams.page) params.append("page", searchParams.page);
    if (searchParams.itemsPerPage)
      params.append("itemsPerPage", searchParams.itemsPerPage);

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

    return basePath;
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
    <div className="hidden xl:flex flex-row flex-wrap gap-x-6 gap-y-3 mb-6">
      <div
        className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300
          cursor-not-allowed gap-x-2 
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
      <div
        className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300 gap-x-2 
          ${
            !activeFilters || activeFilters.length === 0
              ? "bg-[#f3f2f1] text-[#606060]"
              : "bg-primary text-white"
          }`}
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
            style={
              !activeFilters || activeFilters.length === 0
                ? {}
                : { filter: "brightness(0) invert(1)" }
            }
          />
        </Link>
      </div>
    </div>
  );
};

export default FilterControls;
