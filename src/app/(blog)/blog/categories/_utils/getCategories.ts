import { BlogCategory } from "../_types/categories";

export const getCategories = async (): Promise<BlogCategory[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/categories`,
      {
        cache: "force-cache",
        next: { tags: ["categories"], revalidate: 3600 },
      },
    );

    if (!response.ok) {
      console.error("Ошибка при запросе категорий");
      return [];
    }

    const { success, data } = await response.json();
    if (success) return data;

    console.error("Ошибка: ", data.message);
    return [];
  } catch (e) {
    console.error("Ошибка получения категорий: ", e);
    return [];
  }
};
