const fetchProductsByTag = async (
  tag: string,
  options?: {
    randomLimit?: number;
    pagination?: { startIdx: number; perPage: number };
  },
) => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
    url.searchParams.append("tag", tag);

    if (options?.randomLimit) {
      url.searchParams.append("randomLimit", String(options.randomLimit));
    } else if (options?.pagination) {
      url.searchParams.append(
        "startIndex",
        String(options.pagination.startIdx),
      );
      url.searchParams.append("perPage", String(options.pagination.perPage));
    }

    const response = await fetch(String(url), { next: { revalidate: 3600 } });

    if (!response.ok)
      throw new Error(`Error fetching ${tag} product data`);

    const data = await response.json();
    
    return {
      items: data.products || data,
      totalCount: data.totalCount || data.length,
    };
  } catch (e) {
    console.error("Error fetching product data: ", e);
    throw e;
  }
};

export default fetchProductsByTag;
