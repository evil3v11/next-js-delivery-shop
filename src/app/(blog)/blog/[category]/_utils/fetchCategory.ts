import { baseUrl } from "@/utils/baseUrl";

import { CategoryPageResponse } from "@/types/entities";

export const fetchCategoryPageData = async (
  categorySlug: string,
  page: number = 1,
  itemsPerPage: number = 3,
): Promise<CategoryPageResponse | { error: string }> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/blog/${encodeURIComponent(categorySlug)}?page=${page}&itemsPerPage=${itemsPerPage}`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      if (response.status === 404) return { error: "Такой категории не существует" };
      return { error: "Ошибка сервера" };
    }

    return await response.json();
  } catch (e) {
    console.error("Ошибка при запросе данных о категории статей: ", e);
    return { error: "Внутренняя ошибка сервера" };
  }
};
