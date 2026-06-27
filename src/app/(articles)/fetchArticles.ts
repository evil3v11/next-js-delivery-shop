const fetchArticles = async (options?: {
  articlesLimit?: number;
  pagination?: { startIdx: number; perPage: number };
}) => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles`);

    if (options?.articlesLimit) {
      url.searchParams.append("articlesLimit", String(options.articlesLimit));
    } else if (options?.pagination) {
      url.searchParams.append("startIndex", String(options.pagination.startIdx));
      url.searchParams.append("perPage", String(options.pagination.perPage));
    }

    const response = await fetch(String(url), { next: { revalidate: 3600 } });

    if (!response.ok) throw new Error("Ошибка получения статей");

    const data = await response.json();
    return {
      items: data.articles || data,
      totalCount: data.totalCount || data.length,
    };
  } catch (e) {
    console.error("Error fetching articles data: ", e);
    throw e;
  }
};

export default fetchArticles;
