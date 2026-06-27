import fetchPurchases from "../fetchPurchases";
import GenericListPage from "@/app/(products)/GenericListPage";

const AllPurchases = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; itemsPerPage?: string }>;
}) => {
  return (
    <GenericListPage
      searchParams={searchParams}
      props={{
        fetchData: ({ pagination: { startIdx, perPage } }) =>
          fetchPurchases({
            pagination: { startIdx, perPage },
          }),
        pageTitle: "Все покупки",
        basePath: "/purchases",
      }}
    />
  );
};

export default AllPurchases;
