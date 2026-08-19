import { CartItem } from "../cart";
import { UserDataOrNull } from "../userData";
import { Category } from "@/app/(admin)/admin/(cms)/cms/_types/entities";

import { ApiResponse } from "../api/default-response";
import { ArticleFormData, UpdateArticleFormData } from "@/app/(admin)/admin/(cms)/cms/articles/_types";
import {
  CategoryFormData,
  FilterType,
  SortDirection,
  SortField,
  UpdateCategoryFormData,
} from "@/app/(admin)/admin/(cms)/cms/categories/_types";

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
  categories: Category[];
  totalPages: number;
  totalAllItems: number;
  editingId: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  showForm: boolean;
  originalImageUrl: string;
  formData: CategoryFormData;
  currentPage: number;
  totalFilteredItems: number;
  itemsPerPage: number;
  sortField: SortField;
  sortDirection: SortDirection;
  searchQuery: string;
  filterType: FilterType;

  // DnD
  draggedId: string | null;
  draggedOverId: string | null;
  tempOrder: Map<string, number>;
  isReordering: boolean;
  setDraggedId: (draggedId: string | null) => void;
  setDraggedOverId: (draggedOverId: string | null) => void;
  setTempOrder: (tempOrder: Map<string, number>) => void;
  setIsReordering: (isReordering: boolean) => void;
  reorderItems: <T>(items: T[]) => Promise<ApiResponse>;
  //

  setCategories: (categories: Category[]) => void;
  setTotalPages: (totalPages: number) => void;
  setTotalAllItems: (totalAllItems: number) => void;
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
  setCurrentPage: (currentPage: number) => void;
  setTotalFilteredItems: (totalFilteredItems: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setSortField: (sortField: SortField) => void;
  setSortDirection: (sortDirection: SortDirection) => void;
  fetchArticleCategories: (queryParams?: {
    page: number;
    query?: string;
    filterBy?: FilterType;
  }) => Promise<void>;
  createCategory: (
    categoryData: UpdateCategoryFormData,
  ) => Promise<ApiResponse>;
  deleteCategory: (categoryId: string) => Promise<ApiResponse>;
  updateCategory: (
    editingId: string,
    categoryData: UpdateCategoryFormData,
  ) => Promise<ApiResponse>;
  setSearchQuery: (searchQuery: string) => void;
  setFilterType: (filterType: FilterType) => void;
  clearSearchQuery: () => void;
}
export interface ArticleState {
  isSubmitting: boolean;
  formData: ArticleFormData;
  originalImageUrl: string;
  editingId?: string;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setFormData: (formData: ArticleFormData) => void;
  setOriginalImageUrl: (originalImageUrl: string) => void;
  updateFormField: (field: keyof ArticleFormData, value: string | boolean) => void;
  resetFormData: () => void;
  createArticle: (articleData: UpdateArticleFormData) => Promise<ApiResponse>;
}
