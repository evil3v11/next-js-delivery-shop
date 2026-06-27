const fetchPurchases = async (options?: {
  userPurchasesLimit?: number;
  pagination?: { startIdx: number; perPage: number };
}) => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/purchases`);

    if (options?.userPurchasesLimit) {
      url.searchParams.append("userPurchasesLimit", String(options.userPurchasesLimit));
    } else if (options?.pagination) {
      url.searchParams.append("startIndex", String(options.pagination.startIdx));
      url.searchParams.append("perPage", String(options.pagination.perPage));
    }

    const response = await fetch(String(url), { next: { revalidate: 3600 } });

    if (!response.ok) throw new Error("Ошибка получения покупок");

    const data = await response.json();

    return {
      items: data.products || data,
      totalCount: data.totalCount || data.length,
    };
  } catch (e) {
    console.error("Error fetching purchases");
    throw e;
  }
};

export default fetchPurchases;
