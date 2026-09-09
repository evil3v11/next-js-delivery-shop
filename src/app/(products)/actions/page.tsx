import { Metadata } from "next";
import { Suspense } from "react";
import { baseUrl } from "@/utils/baseUrl";

import fetchProductsByTag from "../fetchProducts";
import GenericListPage from "../GenericListPage";
import Loader from "@/components/Loader";

export const metadata: Metadata = {
  title: 'Акции магазина "Северяночка"',
  description: 'Акционные товары магазина "Северяночка"',
  openGraph: {
    title: 'Акции магазина "Северяночка"',
    description: 'Акционные товары магазина "Северяночка"',
    url: `${baseUrl}/actions`,
    images: {
      url: `${baseUrl}/og-images/actions-og.jpg`,
      alt: 'Акции магазина "Северяночка"',
      width: 512,
      height: 512,
    },
  },
};

const AllPromotions = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; itemsPerPage?: string }>;
}) => {
  return (
    <Suspense fallback={<Loader />}>
      <GenericListPage
        searchParams={searchParams}
        props={{
          fetchData: ({ pagination: { startIdx, perPage } }) =>
            fetchProductsByTag("actions", {
              pagination: { startIdx, perPage },
            }),
          pageTitle: "Все акции",
          basePath: "/actions",
        }}
      />
    </Suspense>
  );
};

export default AllPromotions;
