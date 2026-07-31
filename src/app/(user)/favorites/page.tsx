import { fetchFavorites } from "./fetchFavorites";
import { getServerUserId } from "@/utils/getServerUserId";

import { Suspense } from "react";
import Loader from "@/components/Loader";
import GenericListPage from "@/app/(products)/GenericListPage";
import FilterButtons from "@/components/filters/FilterButtons";
import FilterControls from "@/components/filters/FilterControls";
import PriceFilter from "@/components/filters/PriceFilter";
import DropFilter from "@/components/filters/DropFilter";

const FavoritesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    itemsPerPage?: string;
    filter?: string | string[];
    priceFrom?: string;
    priceTo?: string;
    inStock?: string;
  }>;
}) => {
  const category = "favorites";
  const resolvedSearchParams = await searchParams;
  const activeFilters = resolvedSearchParams.filter;
  const priceFrom = resolvedSearchParams.priceFrom;
  const priceTo = resolvedSearchParams.priceTo;
  const inStock = resolvedSearchParams.inStock === "true";

  const userId = await getServerUserId();

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col mx-auto mb-10 w-full">
      <h1
        className="ml-3 xl:ml-0 text-4xl md:text-5xl xl:text-[64px] text-left font-bold text-main-text 
          mb-8 md:mb-10 xl:mb-15 max-w-84 md:max-w-max leading-[150%]"
      >
        Избранное
      </h1>
      <DropFilter
        basePath={`/${category}`}
        category={category}
        userId={userId}
        apiEndpoint="users/favorites/products"
      />
      <div className="hidden xl:flex">
        <FilterButtons basePath={`/${category}`} />
      </div>
      <div className="flex flex-row gap-x-10 justify-center xl:justify-between">
        <div className="hidden xl:flex flex-col w-68 gap-y-10">
          <div
            className="h-11 bg-[#f3f2f1] rounded text-base font-bold text-main-text flex 
              items-center p-2.5"
          >
            Фильтр
          </div>
          <PriceFilter
            basePath={`/${category}`}
            category={category}
            userId={userId}
            apiEndpoint="users/favorites/products"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="hidden xl:flex">
            <FilterControls basePath={`/${category}`} />
          </div>
          <Suspense fallback={<Loader />}>
            <GenericListPage
              searchParams={Promise.resolve(resolvedSearchParams)}
              props={{
                fetchData: ({ pagination: { startIdx, perPage } }) =>
                  fetchFavorites({
                    pagination: { startIdx, perPage },
                    filter: activeFilters,
                    priceFrom,
                    priceTo,
                    inStock,
                    userId,
                  }),
                basePath: `/${category}`,
                contentType: "category",
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
