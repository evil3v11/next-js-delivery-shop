import { CartItem } from "../cart";
import { UserDataOrNull } from "../userData";
import { Article, ArticleStatus, Category } from "@/types/entities";

import { ApiResponse } from "../api/default-response";
import {
  ArticleFormData,
  UpdateArticleFormData,
} from "@/app/(admin)/admin/(cms)/cms/articles/_types";
import {
  CategoryFormData,
  UpdateCategoryFormData,
} from "@/app/(admin)/admin/(cms)/cms/categories/_types";
import { CreateArticleResponse } from "@/app/(admin)/admin/(cms)/cms/_types";
import {
  CategorySortField,
  ArticleSortField,
  SortDirection,
  CategoryFilterType,
  ArticleFilterType,
} from "../filters";

export interface CartState {
  cart: CartItem[];
  totalItems: number;
  isLoading: boolean;
  pricing: PricingState;
  isCheckout: boolean;
  isOrdered: boolean;
  hasLoyaltyCard: boolean;
  doesUseBonuses: boolean;
  fetchCart: () => Promise<void>;
  updateCart: (items: CartItem[]) => void;
  clearCart: () => void;
  updatePricing: (pricing: PricingState) => void;
  setIsCheckout: (isCheckout: boolean) => void;
  setIsOrdered: (isOrdered: boolean) => void;
  setHasLoyaltyCard: (hasLoyaltyCard: boolean) => void;
  setDoesUseBonuses: (doesUseBonuses: boolean) => void;
  resetAfterOrder: () => void;
}

export interface PricingState {
  totalPrice: number;
  totalMaxPrice: number;
  totalDiscount: number;
  finalPrice: number;
  maxBonusAmount: number;
  totalBonuses: number;
  isMinimumReached: boolean;
}

export interface AuthState {
  isAuth: boolean;
  user: UserDataOrNull;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  fetchUserData: () => Promise<void>;
}

export interface ArticleCategoriesState {
  // data for CRUD ops
  categories: Category[];
  editingId: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  showForm: boolean;
  originalImageUrl: string;
  formData: CategoryFormData;
  setCategories: (categories: Category[]) => void;
  setEditingId: (editingId: string | null) => void;
  clearEditingId: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsUploading: (isUploading: boolean) => void;
  setShowForm: (showForm: boolean) => void;
  setOriginalImageUrl: (originalImageUrl: string) => void;
  setFormData: (formData: CategoryFormData) => void;
  updateFormField: (field: keyof CategoryFormData, value: string) => void;
  resetFormData: () => void;
  //

  // CRUD ops
  fetchArticleCategories: (queryParams?: {
    page?: number;
    query?: string;
    filterBy?: CategoryFilterType;
    unlimited?: boolean;
  }) => Promise<void>;
  createCategory: (
    categoryData: UpdateCategoryFormData,
  ) => Promise<ApiResponse>;
  deleteCategory: (categoryId: string) => Promise<ApiResponse>;
  updateCategory: (
    editingId: string,
    categoryData: UpdateCategoryFormData,
  ) => Promise<ApiResponse>;
  //

  // pagination
  totalPages: number;
  totalAllItems: number;
  currentPage: number;
  totalFilteredItems: number;
  itemsPerPage: number;
  setTotalPages: (totalPages: number) => void;
  setTotalAllItems: (totalAllItems: number) => void;
  setCurrentPage: (currentPage: number) => void;
  setTotalFilteredItems: (totalFilteredItems: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  //

  // filters
  sortField: CategorySortField;
  sortDirection: SortDirection;
  searchQuery: string;
  filterType: CategoryFilterType;
  setSortField: (sortField: CategorySortField) => void;
  setSortDirection: (sortDirection: SortDirection) => void;
  setSearchQuery: (searchQuery: string) => void;
  setFilterType: (filterType: CategoryFilterType) => void;
  clearSearchQuery: () => void;
  //
}

export interface ArticleState {
  // data for CRUD ops
  articles: Article[];
  isLoading: boolean;
  isSubmitting: boolean;
  formData: ArticleFormData;
  originalImageUrl: string;
  isUploading: boolean;
  setArticles: (articles: Article[]) => void;
  setArticleData: (articleData: Article) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setFormData: (formData: ArticleFormData) => void;
  updateFormField: (
    field: keyof ArticleFormData,
    value: string | boolean,
  ) => void;
  resetFormData: () => void;
  setOriginalImageUrl: (originalImageUrl: string) => void;
  setIsUploading: (isUploading: boolean) => void;
  //

  // CRUD ops
  fetchArticle: (articleId: string) => Promise<ApiResponse & { data?: Article }>;
  fetchArticles: (queryParams?: {
    page?: number;
    query?: string;
    filterBy?: ArticleFilterType;
  }) => Promise<void>;
  createArticle: (
    articleData: UpdateArticleFormData,
  ) => Promise<CreateArticleResponse>;
  deleteArticle: (articleId: string) => Promise<ApiResponse>;
  updateArticleStatus: (articleId: string, newStatus: ArticleStatus) => Promise<ApiResponse>;
  updateArticleFeatured: (articleId: string, isFeatured: boolean) => Promise<ApiResponse>; 
  //

  // pagination
  totalAllItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  totalFilteredItems: number;
  setTotalAllItems: (totalAllItems: number) => void;
  setTotalPages: (totalPages: number) => void;
  setCurrentPage: (currentPage: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setTotalFilteredItems: (totalFilteredItems: number) => void
  //

  // filters
  sortField: ArticleSortField;
  sortDirection: SortDirection;
  searchQuery: string;
  filterType: ArticleFilterType;
  setSortField: (sortField: ArticleSortField) => void;
  setSortDirection: (sortDirection: SortDirection) => void;
  setSearchQuery: (searchQuery: string) => void;
  setFilterType: (filterType: ArticleFilterType) => void;
  clearSearchQuery: () => void;
  //
}

export interface DnDState {
  // DnD
  draggedId: string | null;
  draggedOverId: string | null;
  tempOrder: Map<string, number>;
  isReordering: boolean;
  setDraggedId: (draggedId: string | null) => void;
  setDraggedOverId: (draggedOverId: string | null) => void;
  setTempOrder: (tempOrder: Map<string, number>) => void;
  setIsReordering: (isReordering: boolean) => void;
  reorderItems: <T>(
    items: T[],
    itemType: "articles" | "categories",
  ) => Promise<ApiResponse>;
  resetDnDStore: () => void;
  //
}
