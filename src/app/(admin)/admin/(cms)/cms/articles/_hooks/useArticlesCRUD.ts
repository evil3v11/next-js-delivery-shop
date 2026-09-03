import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useArticleStore } from "@/store/articleStore";
import { useAuthStore } from "@/store/authStore";
import { useArticleCategoriesStore } from "@/store/articleCategoriesStore";
import { useDnDStore } from "@/store/dndStore";
import { useArticleFormState } from "./useArticleFormState";

import { Article } from "@/types/entities";

export const useArticlesCRUD = (
  uploadImageToServer?: () => Promise<{ url: string; fileName: string } | null>,
) => {
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { user } = useAuthStore();
  const author = `${user?.lastName} ${user?.name}`.trim() || "Неизвестен";

  const searchParams = useSearchParams();

  const {
    fetchArticle,
    fetchArticles,
    formData,
    setIsSubmitting,
    createArticle,
    currentPage,
    // deleteArticle,
    setItemsPerPage,
    setCurrentPage,
    setIsLoading,
    setArticleData,
    resetFormData,
  } = useArticleStore();

  const { setIsReordering, reorderItems } = useDnDStore();

  const { getKeywordsArray } = useArticleFormState();

  const { fetchArticleCategories } = useArticleCategoriesStore();

  useEffect(() => {
    const getArticleWithId = async () => {
      const articleId = searchParams.get("id");
      if (!articleId) return;

      try {
        setIsLoading(true);
        setCurrentArticleId(articleId);

        const { success, message, data } = await fetchArticle(articleId);
        if (success && data) {
          setArticleData(data);
        } else {
          setNotification({
            type: "error",
            message,
          });
        }
      } catch (e) {
        console.error("Ошибка при загрузке статьи: ", e);
        setNotification({
          type: "error",
          message: e instanceof Error ? e.message : "Неизвестная ошибка",
        });
        resetFormData();
      } finally {
        setIsLoading(false);
      }
    };

    getArticleWithId();
  }, [searchParams, setIsLoading, fetchArticle, setArticleData, resetFormData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await fetchArticleCategories({ unlimited: true });
      } catch (e) {
        console.error("Ошибка загрузки категорий: ", e);
      }
    };

    fetchCategories();
  }, [fetchArticleCategories]);

  useEffect(() => {
    fetchArticles({ page: currentPage });
  }, [fetchArticles, currentPage]);

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  const handleCreateArticle = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      let finalImageUrl = "";
      if (
        formData.image &&
        formData.image.startsWith("blob:") &&
        uploadImageToServer
      ) {
        try {
          const uploadResult = await uploadImageToServer();
          if (uploadResult) finalImageUrl = uploadResult.url;
          else throw new Error("Не удалось загрузить изображение");
        } catch (uploadError) {
          console.error("Ошибка при загрузке изображения: ", uploadError);
          setNotification({
            type: "error",
            message: "Не удалось загрузить изображение",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const articleId = currentArticleId || undefined;

      const articleData = {
        ...formData,
        keywords: getKeywordsArray(),
        image: finalImageUrl,
        numericId: null,
        author,
        content: formData.content || "",
        status: formData.status || "draft",
        isFeatured: formData.isFeatured || false,
        views: 0,
        _id: articleId,
      };

      const { success, message, data } = await createArticle(articleData);
      if (success) {
        if (data?._id && !currentArticleId) {
          setCurrentArticleId(String(data._id));
        }

        setNotification({
          type: "success",
          message: currentArticleId
            ? "Изменения сохранены"
            : "Статья успешно создана",
        });
      } else {
        setNotification({
          type: "error",
          message: message || "Ошибка создания статьи",
        });
      }
    } catch (e) {
      console.error("Непредвиденная ошибка: ", e);
      setNotification({
        type: "error",
        message: "Непредвиденная ошибка сервера",
      });
    } finally {
      setIsSubmitting(false);
      window.scroll({ top: 0, behavior: "smooth" });
    }
  };

  // const handleDeleteArticle = async (categoryId: string): Promise<void> => {
  //   if (!confirm("Вы уверены, что хотите удалить эту категорию?")) return;
  //   const categoryToDelete = categories.find(
  //     (c) => String(c._id) === categoryId,
  //   );

  //   const { success, message } = await deleteArticle(categoryId);
  //   if (success) {
  //     if (categoryToDelete?.image) {
  //       try {
  //         await deleteOldImage(categoryToDelete.image);
  //       } catch (e) {
  //         console.error("Не удалось удалить изображение: ", e);
  //       }
  //     }

  //     setNotification({
  //       type: "success",
  //       message: "Категория успешно удалена",
  //     });
  //   } else {
  //     setNotification({
  //       type: "error",
  //       message: message || "Ошибка при удалении категории статей",
  //     });
  //   }
  // };

  const handleReorder = async (reorderedItems: Article[]): Promise<void> => {
    try {
      setIsReordering(true);

      const updateData = reorderedItems;

      const { success, message } = await reorderItems(updateData, "articles");
      if (success) {
        setNotification({
          type: "success",
          message,
        });
        await fetchArticles({ page: currentPage });
      } else {
        setNotification({
          type: "error",
          message,
        });
        throw new Error(message);
      }
    } catch (e) {
      console.log("Ошибка при обновлении порядка: ", e);
      setNotification({
        type: "error",
        message: `Ошибка при обновлении порядка: ${e}`,
      });
    } finally {
      setIsReordering(false);
    }
  };

  const handleItemsPerPageChange = (itemsPerPage: number): void => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
    fetchArticles({ page: 1 });
  };

  return {
    notification,
    setNotification,
    handleCreateArticle,
    // handleDeleteArticle,
    handleReorder,
    handleItemsPerPageChange,
  };
};
