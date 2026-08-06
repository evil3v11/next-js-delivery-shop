import { Suspense } from "react";

import { getServerUserId } from "@/utils/getServerUserId";

import fetchPurchases from "../fetchPurchases";
import GenericListPage from "@/app/(products)/GenericListPage";
import Loader from "@/components/Loader";

const AllPurchases = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; itemsPerPage?: string }>;
}) => {
  const userId = await getServerUserId()
  return (
    <Suspense fallback={<Loader />}>
      <GenericListPage
        searchParams={searchParams}
        props={{
          fetchData: ({ pagination: { startIdx, perPage } }) =>
            fetchPurchases({
              pagination: { startIdx, perPage },
              userId
            }),
          pageTitle: "Все покупки",
          basePath: "/purchases",
        }}
      />
    </Suspense>
  );
};

export default AllPurchases;
