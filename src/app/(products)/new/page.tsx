import fetchProductsByCategory from "../fetchProducts";
import GenericListPage from "../GenericListPage";

export const metadata = {
  title: 'Новинки магазина "Северяночка"',
  description: 'Новые товары магазина "Северяночка"',
};

const AllNewProducts = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; itemsPerPage?: string }>;
}) => {
  return (
    <GenericListPage
      searchParams={searchParams}
      props={{
        fetchData: () => fetchProductsByCategory("new"),
        pageTitle: "Все новинки",
        basePath: "/new",
      }}
    />
  );
};

export default AllNewProducts;
