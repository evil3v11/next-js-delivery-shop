export const fetchProductsByCategory = async (
  category: string,
  options: {
    pagination: { startIdx: number; perPage: number };
  },
) => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category`);
    url.searchParams.append("category", category);
    url.searchParams.append("startIndex", String(options.pagination.startIdx));
    url.searchParams.append("perPage", String(options.pagination.perPage));

    const response = await fetch(String(url), { next: { revalidate: 3600 } });
    if (!response.ok)
      throw new Error(
        `Ошибка сервера при получении продуктов из категории ${category}`,
      );

    const data = await response.json();
    return {
      items: data.products || data,
      totalCount: data.totalCount || data.length,
    };
  } catch (e) {
    throw e;
  }
};
