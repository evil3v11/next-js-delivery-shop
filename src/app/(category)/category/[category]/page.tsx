import { fetchProductsByCategory } from "../fetchCategory";
import { TRANSLATIONS } from "@/utils/translations";

import GenericListPage from "@/app/(products)/GenericListPage";
import { Suspense } from "react";
import Loader from "@/components/Loader";

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
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
}) => {
  const { category } = await params;
  return (
    <Suspense fallback={<Loader />}>
      <GenericListPage
        searchParams={searchParams}
        props={{
          fetchData: ({ pagination: { startIdx, perPage } }) =>
            fetchProductsByCategory(category, {
              pagination: { startIdx, perPage },
            }),
          pageTitle: TRANSLATIONS[category] || category,
          basePath: `/category/${category}`,
          contentType: "category",
        }}
      />
    </Suspense>
  );
};

export default CategoryPage;
