import { fetchProductsByCategory } from "../fetchCategory";
import { TRANSLATIONS } from "@/utils/translations";

import GenericListPage from "@/app/(products)/GenericListPage";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import FilterButtons from "../FilterButtons";
import FilterControls from "../FilterControls";

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
  }>;
}) => {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const activeFilters = resolvedSearchParams.filter;

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] mb-10">
      <h1 className="text-2xl xl:text-4xl text-left font-bold text-[#414141] mb-15">
        {TRANSLATIONS[category] || category}
      </h1>
      <FilterButtons basePath={`/category/${category}`} />
      <FilterControls
        activeFilters={resolvedSearchParams.filter}
        basePath={`/category/${category}`}
        searchParams={{
          page: resolvedSearchParams.page,
          itemsPerPage: resolvedSearchParams.itemsPerPage,
        }}
      />
      <Suspense fallback={<Loader />}>
        <GenericListPage
          searchParams={Promise.resolve(resolvedSearchParams)}
          props={{
            fetchData: ({ pagination: { startIdx, perPage } }) =>
              fetchProductsByCategory(category, {
                pagination: { startIdx, perPage },
                filter: activeFilters,
              }),
            pageTitle: "",
            basePath: `/category/${category}`,
            contentType: "category",
          }}
        />
      </Suspense>
    </div>
  );
};

export default CategoryPage;
