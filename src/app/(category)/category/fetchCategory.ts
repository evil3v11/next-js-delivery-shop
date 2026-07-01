export const fetchProductsByCategory = async (
  category: string,
  options: {
    pagination: { startIdx: number; perPage: number };
    filter?: string | string[];
    priceFrom?: string;
    priceTo?: string;
    inStock?: boolean;
  },
) => {
  const { pagination, filter, priceFrom, priceTo, inStock } = options;

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category`);
    url.searchParams.append("category", category);
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
    console.log(String(url))
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
