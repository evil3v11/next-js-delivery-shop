import { cache } from "react";
import { Metadata } from "next";

import { baseUrl } from "@/utils/baseUrl";
import { fetchArticlePageData } from "../_utils/fetchArticle";
import { sanitizeArticleHTML } from "@/utils/sanitizeArticleHTML";

import ArticleHeader from "./_components/ArticleHeader";
import ArticleMeta from "./_components/ArticleMeta";
import ArticleImage from "./_components/ArticleImage";
import ArticleContent from "./_components/ArticleContent";
import ArticleAuthor from "./_components/ArticleAuthor";

const fetchCachedArticlesData = cache(fetchArticlePageData);

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> => {
  const { category, slug } = await params;

  const result = await fetchCachedArticlesData(category, slug);

  if ("error" in result) {
    return {
      title: "Статья не найдена",
      description: "Запрашиваемая статья не существует.",
    };
  }

  const { article, category: categoryData } = result;

  const title = `${article.name}`;
  const description = article.description || article.name;
  const keywords = article.keywords.map((k) => k.toLowerCase()) || [];

  const canonicalUrl = `${baseUrl}/blog/${categoryData.slug}/${article.slug}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: { canonical: canonicalUrl },
    keywords,
    openGraph: {
      title: article.name,
      description,
      type: "article",
      url: canonicalUrl,
    },
  };
};

const BlogArticlePage = async ({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) => {
  const { category, slug } = await params;

  const result = await fetchCachedArticlesData(category, slug);

  if ("error" in result) {
    const error = result.error;

    switch (error) {
      case "Такой категории не существует":
        return (
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Категория не найдена</h1>
            <p className="text-gray-600">Slug категории: {category}</p>
          </div>
        );
      case "Такой статьи не существует":
        return (
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
            <p className="text-gray-600">Slug статьи: {slug}</p>
            <p className="text-gray-600">В категории: {category}</p>
          </div>
        );
      default:
        return (
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Ошибка загрузки</h1>
            <p className="text-gray-600">
              Произошла ошибка при загрузке статьи: {error}
            </p>
          </div>
        );
    }
  }

  const { article, category: categoryData } = result;
  const safeContent = sanitizeArticleHTML(article.content || "");
  const publishedDate = article.publishedAt;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <ArticleHeader
        articleTitle={article.name}
        categoryName={categoryData.name}
      />
      <ArticleMeta
        categoryName={categoryData.name}
        publishedDate={publishedDate}
        views={article.views}
      />
      <ArticleImage
        image={article.image}
        imageAlt={article.imageAlt}
        articleName={article.name}
      />
      <ArticleContent html={safeContent} />
      <ArticleAuthor author={article.author!} />
    </div>
  );
};

export default BlogArticlePage;
