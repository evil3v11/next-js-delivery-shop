import { fetchProductsByCategory } from "./fetchCategory";
import { TRANSLATIONS } from "@/utils/translations";

import GenericListPage from "@/app/(products)/GenericListPage";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import FilterButtons from "./_components/FilterButtons";
import FilterControls from "./_components/FilterControls";
import PriceFilter from "./_components/PriceFilter";
import DropFilter from "./_components/DropFilter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return {
    title: TRANSLATIONS[category] || category,
    description: `Описание категории ${TRANSLATIONS[category] || category} магазина Северяночка`,
  };
}

const CategoryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    page?: string;
    itemsPerPage?: string;
    filter?: string | string[];
    priceFrom?: string;
    priceTo?: string;
    inStock?: string;
  }>;
}) => {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const activeFilters = resolvedSearchParams.filter;
  const priceFrom = resolvedSearchParams.priceFrom;
  const priceTo = resolvedSearchParams.priceTo;
  const inStock = resolvedSearchParams.inStock === "true";

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col mx-auto mb-10">
      <h1
        className="ml-3 xl:ml-0 text-4xl md:text-5xl text-left font-bold text-main-text 
          mb-8 md:mb-10 xl:mb-15 max-w-84 md:max-w-max leading-[150%]"
      >
        {TRANSLATIONS[category] || category}
      </h1>
      <DropFilter basePath={`/catalog/${category}`} category={category} />
      <div className="hidden xl:flex">
        <FilterButtons basePath={`/catalog/${category}`} />
      </div>
      <div className="flex flex-row gap-x-10 justify-between">
        <div className="hidden xl:flex flex-col w-68 gap-y-10">
          <div
            className="h-11 bg-[#f3f2f1] rounded text-base font-bold text-main-text flex 
              items-center p-2.5"
          >
            Фильтр
          </div>
          <PriceFilter basePath={`/catalog/${category}`} category={category} />
        </div>
        <div className="flex flex-col">
          <div className="hidden xl:flex">
            <FilterControls basePath={`/catalog/${category}`} />
          </div>
          <Suspense fallback={<Loader />}>
            <GenericListPage
              searchParams={Promise.resolve(resolvedSearchParams)}
              props={{
                fetchData: ({ pagination: { startIdx, perPage } }) =>
                  fetchProductsByCategory(category, {
                    pagination: { startIdx, perPage },
                    filter: activeFilters,
                    priceFrom,
                    priceTo,
                    inStock,
                  }),
                basePath: `/catalog/${category}`,
                contentType: "category",
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
