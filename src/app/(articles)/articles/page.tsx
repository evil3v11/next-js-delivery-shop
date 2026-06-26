import GenericListPage from "@/app/(products)/GenericListPage";
import fetchArticles from "../fetchArticles";

export const metadata = {
  title: 'Статьи на сайте магазина "Северяночка"',
  description: 'Читайте статьи на сайте магазина "Северяночка"',
};

const AllArticles = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; itemsPerPage?: string }>;
}) => {
  return (
    <GenericListPage
      searchParams={searchParams}
      props={{
        fetchData: () => fetchArticles(),
        pageTitle: "Все статьи",
        basePath: "/articles",
        contentType: "articles",
      }}
    />
  );
};

export default AllArticles;
