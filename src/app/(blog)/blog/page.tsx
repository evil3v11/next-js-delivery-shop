import { Metadata } from "next";
import { getCategories } from "./categories/_utils/getCategories";
import { baseUrl } from "@/utils/baseUrl";

import BlogPageHeader from "./categories/_components/BlogPageHeader";
import CategoriesList from "./categories/_components/CategoriesList";
import StatsInfo from "./categories/_components/StatsInfo";
import EmptyCategoriesState from "./categories/_components/EmptyCategoriesState";
import CategoriesSidebar from "./categories/_components/Sidebar/CategoriesSidebar";

const truncate = (str: string, maxLength: number): string =>
  str.length <= maxLength ? str : str.substring(0, maxLength - 3) + "...";

export const generateMetadata = async (): Promise<Metadata> => {
  const categories = await getCategories();
  const categoryNames = categories.map((cat) => cat.name);

  const title =
    categoryNames.length > 0
      ? truncate(`Блог: ${categoryNames.slice(0, 3).join(", ")}`, 60)
      : "Блог";

  const description =
    categoryNames.length > 0
      ? truncate(
          `Исследуйте статьи по категориям: ${categoryNames.slice(0, 8).join(", ")}.`,
          160,
        )
      : truncate("Блог с полезными статьями.", 160);

  const keywords = [...categoryNames.map((name) => name.toLowerCase())];

  return {
    metadataBase: new URL(`${baseUrl}/blog`),
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/blog`,
    },
    keywords: [...new Set(keywords)],
    openGraph: {
      title: 'Блог "Северяночка"',
      description,
      type: "article",
      url: `${baseUrl}/blog`,
    },
  };
};

const BlogPage = async () => {
  const categories = await getCategories();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <BlogPageHeader />
        {!categories ? (
          <>
            <EmptyCategoriesState />
          </>
        ) : (
          <>
            <CategoriesList categories={categories} />
            <StatsInfo count={categories.length} />
          </>
        )}
        <CategoriesSidebar />
      </div>
    </div>
  );
};

export default BlogPage;
