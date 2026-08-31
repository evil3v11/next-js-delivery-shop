import { Activity } from "react";
import { Metadata } from "next";

import { CONFIG } from "@/../config/config";
import { baseUrl } from "@/utils/baseUrl";
import { fetchCategoryPageData } from "./_utils/fetchCategory";
import { getColorFromName } from "@/utils/getColorFromName";

import EmptyCategory from "./_components/EmptyCategory";
import CategoryHeader from "./_components/CategoryHeader";
import CategoryImage from "./_components/CategoryImage";
import ArticlesList from "./_components/ArticlesList";
import CategoryStats from "./_components/CategoryStats";
import Pagination from "@/components/Pagination";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> => {
  const { category } = await params;

  const result = await fetchCategoryPageData(category, 1, 1);

  if ("error" in result) {
    return {
      title: "Категория не найдена",
      description: "Запрашиваемая категория статей не существует.",
    };
  }

  const title = `${result.category.name}`;
  const keywords = [...(result.category.keywords || [])];
  const description = result.category.description
    ? `${result.category.description} ${result.totalArticles > 0 ? `Читайте ${result.totalArticles} статей по теме.` : "Статьи по данной теме."}`
    : `Читайте "${result.category.name}". ${result.totalArticles > 0 ? `Доступно ${result.totalArticles} статей.` : ""}`;

  return {
    metadataBase: new URL(`${baseUrl}/blog`),
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/blog/${result.category.slug}`,
    },
    keywords,
    openGraph: {
      title: `${result.category.name}`,
      description: description.substring(0, 200),
      type: "website",
      url: `${baseUrl}/blog/${result.category.slug}`,
    },
  };
};

const BlogCategoryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page: string }>;
}) => {
  const { category } = await params;
  const { page = "1" } = await searchParams;

  const itemsPerPage = CONFIG.ARTICLES_PER_BLOG_PAGE;
  const currentPage = Number(page) || 1;

  const result = await fetchCategoryPageData(
    category,
    currentPage,
    itemsPerPage,
  );

  if ("error" in result) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Категория не найдена</h1>
        <p className="text-gray-600">Slug категории: {category}</p>
      </div>
    );
  }

  const {
    category: categoryData,
    articles: articlesData,
    totalArticles,
    totalPages,
  } = result;

  const gradientColor = getColorFromName(categoryData.name);
  const hasImage = !!(categoryData.image && categoryData.imageAlt?.startsWith("/"));
  const basePath = `/blog/${categoryData.slug}`
  const searchQuery = `page=${currentPage}&itemsPerPage=${itemsPerPage}`

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col items-center gap-4">
        <CategoryHeader
          title={categoryData.name}
          description={categoryData.description}
        />
        <CategoryImage
          category={categoryData}
          gradientColor={gradientColor}
          hasImage={hasImage}
        />
      </div>
      {articlesData.length > 0 ? (
        <>
          <ArticlesList
            articles={articlesData}
            categoryName={categoryData.name}
            categorySlug={categoryData.slug}
          />
          <Activity mode={totalPages > 1 ? "visible" : "hidden"}>
            <Pagination
              totalItems={totalArticles}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              basePath={basePath}
              searchQuery={searchQuery}
            />
          </Activity>
          <CategoryStats
            totalArticles={totalArticles}
            totalPages={totalPages}
            currentPage={currentPage}
            articlesCount={articlesData.length}
          />
        </>
      ) : (
        <EmptyCategory />
      )}
    </div>
  );
};

export default BlogCategoryPage;
