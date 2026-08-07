export const fetchFavorites = async (options: {
  pagination: { startIdx: number; perPage: number };
  filter?: string | string[];
  priceFrom?: string;
  priceTo?: string;
  inStock?: boolean;
  userId?: string | null;
}) => {
  try {
    const { pagination, filter, priceFrom, priceTo, inStock, userId } = options;

    if (!userId) return { products: [], totalCount: 0 };

    const url = new URL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/favorites/products`,
    );
    url.searchParams.append("userId", String(userId));
    url.searchParams.append("startIndex", String(pagination.startIdx));
    url.searchParams.append("perPage", String(pagination.perPage));

    if (filter) {
      if (Array.isArray(filter)) {
        filter.forEach((f) => url.searchParams.append("filter", f));
      } else {
        url.searchParams.append("filter", filter);
      }
    }

    if (priceFrom) {
      url.searchParams.append("priceFrom", priceFrom);
    }
    if (priceTo) {
      url.searchParams.append("priceTo", priceTo);
    }
    if (inStock) {
      url.searchParams.append("inStock", String(inStock));
    }

    const response = await fetch(String(url), { next: { revalidate: 60 } });
    if (!response.ok) throw new Error(`Ошибка сервера при получении продуктов из Избранных`);

    return await response.json();
  } catch (e) {
    throw e;
  }
};
