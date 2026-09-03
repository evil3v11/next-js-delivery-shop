import { create } from "zustand";

import { CONFIG } from "../../config/config";

import type { ArticleState } from "@/types/store/storeState";
import type { ArticleFormData } from "@/app/(admin)/admin/(cms)/cms/articles/_types";

const initialFormData: ArticleFormData = {
  _id: "",
  name: "",
  slug: "",
  description: "",
  keywords: "",
  image: "",
  imageAlt: "",
  categoryId: "",
  categoryName: "",
  categorySlug: "",
  status: "draft",
  content: "",
  metaTitle: "",
  metaDescription: "",
  isFeatured: false,
};

export const useArticleStore = create<ArticleState>((set, get) => ({
  // data for CRUD ops
  articles: [],
  isLoading: false,
  isSubmitting: false,
  formData: initialFormData,
  originalImageUrl: "",
  isUploading: false,
  setArticles: (articles) => set({ articles }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setFormData: (formData) => set({ formData }),
  setOriginalImageUrl: (originalImageUrl) => set({ originalImageUrl }),
  updateFormField: (field, value) => set((state) => ({ formData: { ...state.formData, [field]: value } })),
  resetFormData: () => set({ formData: initialFormData }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setArticleData: (articleData) =>
    set({
      formData: {
        ...articleData,
        _id: articleData._id || "",
        description: articleData.description || "",
        keywords: articleData.keywords?.join(", ") || "",
        image: articleData.image || "",
        imageAlt: articleData.imageAlt || "",
        content: articleData.content || "",
        status: articleData.status || "draft",
        isFeatured: Boolean(articleData.isFeatured),
      },
    }),
  //

  // CRUD ops
  fetchArticle: async (id) => {
    try {
      const response = await fetch(`/admin/cms/api/articles/${id}`);
      return await response.json();
    } catch (e) {
      console.error("Ошибка при получении информации о статье: ", e);
      return {
        success: false,
        message: e instanceof Error ? e.message : "Неизвестная ошибка",
      };
    }
  },
  fetchArticles: async (queryParams) => {
    try {
      set({ isLoading: true });
      const state = get();

      const query = new URLSearchParams();
      const pageToLoad = queryParams?.page ?? state.currentPage;
      const searchQuery = queryParams?.query ?? state.searchQuery;
      const filterBy = queryParams?.filterBy ?? state.filterType;

      query.append("page", String(pageToLoad));
      query.append("sortBy", state.sortField);
      query.append("sortOrder", state.sortDirection);
      query.append("query", searchQuery);
      query.append("filterBy", filterBy);
      query.append("limit", String(state.itemsPerPage));

      const response = await fetch(`/admin/cms/api/articles?${query}`);
      const { success, data } = await response.json();

      if (response.ok && success) {
        set({
          articles: data.articles,
          totalAllItems: data.totalAmount,
          totalFilteredItems: data.pagination.totalFilteredItems,
          totalPages: data.pagination.totalPages,
          currentPage: queryParams?.page ?? state.currentPage,
          searchQuery: queryParams?.query ?? state.searchQuery,
          filterType: queryParams?.filterBy ?? state.filterType,
        });
      }
    } catch (e) {
      console.error("Ошибка при загрузке статей: ", e);
    } finally {
      set({ isLoading: false });
    }
  },
  createArticle: async (articleData) => {
    try {
      const response = await fetch("/admin/cms/api/articles", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(articleData),
      });

      return await response.json();
    } catch (e) {
      console.error("Ошибка при создании новой статьи: ", e);
      return {
        success: false,
        message: `Ошибка при создании новой статьи: ${e}`,
      };
    }
  },
  deleteArticle: async (articleId) => {
    try {
      const state = get();
      const response = await fetch(`/admin/cms/api/articles/${articleId}`, {
        method: "DELETE",
      });

      const { success, message } = await response.json();
      if (response.ok && success) {
        await state.fetchArticles({ page: state.currentPage });
      }

      return { success, message };
    } catch (e) {
      console.error("Ошибка при удалении статьи: ", e);
      return {
        success: false,
        message: `Ошибка при удалении статьи: ${e}`,
      };
    }
  },
  updateArticleStatus: async (articleId, newStatus) => {
    try {
      set({ isSubmitting: true });
      const response = await fetch("/admin/cms/api/articles/update-status", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: articleId, status: newStatus }),
      });

      const { success, message } = await response.json();
      if (success) {
        const { articles } = get();
        const updatedArticles = articles.map((a) =>
          String(a._id) === articleId ? { ...a, status: newStatus } : a,
        );
        set({ articles: updatedArticles });
      }

      return { success, message };
    } catch (e) {
      console.error("Ошибка при обновлении статуса статьи: ", e);
      return {
        success: false,
        message: "Ошибка при обновлении статуса статьи",
      };
    } finally {
      set({ isSubmitting: false });
    }
  },
  updateArticleFeatured: async (articleId, isFeatured) => {
    try {
      set({ isSubmitting: true });
      const response = await fetch("/admin/cms/api/articles/update-featured", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: articleId, isFeatured }),
      });

      const { success, message } = await response.json();
      if (success) {
        const { articles } = get();
        const updatedArticles = articles.map((a) =>
          String(a._id) === articleId ? { ...a, isFeatured } : a,
        );
        set({ articles: updatedArticles });
      }

      return { success, message };
    } catch (e) {
      console.error("Ошибка при обновлении избранности статьи: ", e);
      return {
        success: false,
        message: "Ошибка при обновлении избранности статьи",
      };
    } finally {
      set({ isSubmitting: false });
    }
  },
  //

  // TODO:
  // I think it's better to split up this store.
  // The only thing that makes sense for this store is CRUD.
  // Everything else (pagination, filters) can be extracted to their own respective stores or custom hooks.

  // pagination
  totalAllItems: 0,
  totalFilteredItems: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: CONFIG.ARTICLES_PER_BLOG_PAGE,
  setTotalAllItems: (totalAllItems) => set({ totalAllItems }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
  setTotalFilteredItems: (totalFilteredItems) => set({ totalFilteredItems }),
  //

  // filters
  sortField: "numericId",
  sortDirection: "asc",
  searchQuery: "",
  filterType: "all",
  setSortField: (sortField) => set({ sortField }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterType: (filterType) => set({ filterType }),
  clearSearchQuery: () => set({ searchQuery: "" }),
  //
}));
