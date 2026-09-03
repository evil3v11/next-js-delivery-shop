import { baseUrl } from "@/utils/baseUrl";

import { ArticlePageData, FetchArticleError } from "@/types/entities";
import { getServerUserId } from "@/utils/getServerUserId";
import { getUserById } from "@/utils/auth-helpers";

export const fetchArticlePageData = async (
  categorySlug: string,
  articleSlug: string,
): Promise<ArticlePageData | FetchArticleError> => {
  const currentUserId = await getServerUserId();

  let currentUserData = null;

  if (currentUserId) {
    try {
      currentUserData = await getUserById(currentUserId);
    } catch (e) {
      console.error("Не удалось получить данные о пользователе: ", e);
    }
  }

  const userRole = currentUserData?.role ?? "user";

  try {
    const response = await fetch(
      `${baseUrl}/api/blog/${categorySlug}/${articleSlug}?role=${userRole}`,
      { next: { revalidate: 3600 } },
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
