import { baseUrl } from "@/utils/baseUrl";

const fetchArticles = async (options?: {
  articlesLimit?: number;
  pagination?: { startIdx: number; perPage: number };
}) => {
  try {
    const url = new URL(`${baseUrl}/api/articles`);

    if (options?.articlesLimit) {
      url.searchParams.append("articlesLimit", String(options.articlesLimit));
    } else if (options?.pagination) {
      url.searchParams.append("startIndex", String(options.pagination.startIdx));
      url.searchParams.append("perPage", String(options.pagination.perPage));
    }

    const response = await fetch(String(url), { next: { revalidate: 3600 } });

    if (!response.ok) throw new Error("Ошибка получения статей");

    return await response.json();
  } catch (e) {
    console.error("Error fetching articles data: ", e);
    throw e;
  }
};

export default fetchArticles;
