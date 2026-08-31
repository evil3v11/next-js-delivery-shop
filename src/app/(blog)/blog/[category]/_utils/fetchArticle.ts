import { baseUrl } from "@/utils/baseUrl";

import { ArticlePageData, FetchArticleError } from "@/types/entities";

export const fetchArticlePageData = async (
  categorySlug: string,
  articleSlug: string,
): Promise<ArticlePageData | FetchArticleError> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/blog/${categorySlug}/${articleSlug}`,
      { cache: "no-store", headers: { "cache-control": "no-cache" } },
    );

    if (!response.ok) {
      if (response.status === 404) return { error: "Такой cтатьи не существует" };
      return { error: "Ошибка сервера" };
    }

    return await response.json();
  } catch (e) {
    console.error("Ошибка при запросе данных о статье: ", e);
    return { error: "Внутренняя ошибка сервера" };
  }
};
