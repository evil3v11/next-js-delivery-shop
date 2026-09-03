import { create } from "zustand";

import { CMS_CONFIG } from "@/app/(admin)/admin/(cms)/cms/cms_config";

import type { ArticleCategoriesState } from "@/types/store/storeState";

export const useArticleCategoriesStore = create<ArticleCategoriesState>(
  (set, get) => ({
    // data for CRUD ops
    categories: [],
    formData: CMS_CONFIG.INITIAL_FORM_DATA,
    showForm: false,
    editingId: null,
    isLoading: false,
    isSubmitting: false,
    isUploading: false,
    originalImageUrl: "",
    setCategories: (categories) => set({ categories }),
    setFormData: (formData) => set({ formData }),
    setShowForm: (showForm) => set({ showForm }),
    setEditingId: (editingId) => set({ editingId }),
    clearEditingId: () => set({ editingId: null }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    setIsUploading: (isUploading) => set({ isUploading }),
    setOriginalImageUrl: (originalImageUrl) => set({ originalImageUrl }),
    updateFormField: (field, value) => set((state) => ({ formData: { ...state.formData, [field]: value } })),
    resetFormData: () => set({ formData: CMS_CONFIG.INITIAL_FORM_DATA }),

    // CRUD ops
    fetchArticleCategories: async (queryParams) => {
      try {
        set({ isLoading: true });
        const state = get();

        const query = new URLSearchParams();
        const pageToLoad = queryParams?.page ?? state.currentPage;
        const searchQuery = queryParams?.query ?? state.searchQuery;
        const filterBy = queryParams?.filterBy ?? state.filterType;
        const unlimited = queryParams?.unlimited ?? false;

        query.append("page", String(pageToLoad));
        query.append("sortBy", state.sortField);
        query.append("sortOrder", state.sortDirection);
        query.append("query", searchQuery);
        query.append("filterBy", filterBy);

        if (unlimited) {
          query.append("limit", '');
        } else {
          query.append("limit", String(state.itemsPerPage));
        }

        const response = await fetch(`/admin/cms/api/categories?${query}`);
        const { success, data, totalAmount } = await response.json();

        if (response.ok && success) {
          set({
            categories: data.categories,
            totalAllItems: totalAmount,
            totalFilteredItems: data.pagination.totalFilteredItems,
            totalPages: data.pagination.totalPages,
            currentPage: queryParams?.page ?? state.currentPage,
            searchQuery: queryParams?.query ?? state.searchQuery,
            filterType: queryParams?.filterBy ?? state.filterType,
          });
        }
      } catch (e) {
        console.error("Ошибка при загрузке категорий статей: ", e);
      } finally {
        set({ isLoading: false });
      }
    },
    createCategory: async (categoryData) => {
      try {
        const state = get();
        const response = await fetch("/admin/cms/api/categories", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(categoryData),
        });

        const { success, message } = await response.json();
        if (response.ok && success) {
          await state.fetchArticleCategories({ page: 1 });
        }

        return {
          success,
          message,
        };
      } catch (e) {
        console.error("Ошибка при создании новой категории: ", e);
        return {
          success: false,
          message: `Ошибка при создании новой категории: ${e}`,
        };
      }
    },
    updateCategory: async (editingId, categoryData) => {
      try {
        const state = get();
        const response = await fetch(`/admin/cms/api/categories/${editingId}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(categoryData),
        });
        const { success, message } = await response.json();

        if (response.ok && success) {
          await state.fetchArticleCategories({ page: state.currentPage });
        }
        return { success, message };
      } catch (e) {
        console.error("Ошибка при удалении категории статей: ", e);
        return {
          success: false,
          message: `Ошибка при обновлении категории статей: ${e}`,
        };
      }
    },
    deleteCategory: async (categoryId) => {
      try {
        const state = get();
        const response = await fetch(
          `/admin/cms/api/categories/${categoryId}`,
          { method: "DELETE" },
        );

        const { success, message } = await response.json();
        if (response.ok && success) {
          await state.fetchArticleCategories({ page: state.currentPage });
        }

        return { success, message };
      } catch (e) {
        console.error("Ошибка при удалении категории статей: ", e);
        return {
          success: false,
          message: `Ошибка при удалении категории статей: ${e}`,
        };
      }
    },
    //

    // pagination 
    totalPages: 0,
    totalAllItems: 0,
    totalFilteredItems: 0,
    currentPage: 1,
    itemsPerPage: CMS_CONFIG.ITEMS_PER_PAGE,
    setTotalPages: (totalPages) => set({ totalPages }),
    setTotalAllItems: (totalAllItems) => set({ totalAllItems }),
    setTotalFilteredItems: (totalFilteredItems) => set({ totalFilteredItems }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
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
  }),
);
