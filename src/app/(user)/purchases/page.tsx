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
        fetchData: () => fetchPurchases(),
        pageTitle: "Все покупки",
        basePath: "/purchases",
      }}
    />
  );
};

export default AllPurchases;
