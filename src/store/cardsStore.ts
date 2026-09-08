import { create } from "zustand";

import { CARDS_CONFIG } from "@/app/(admin)/admin/cards/_utils/CARDS_CONFIG";

import { CardsState } from "@/types/store/storeState";
import { GetCardsParams } from "@/app/(admin)/admin/cards/_types";

export const useCardsStore = create<CardsState>((set, get) => ({
  cards: [],
  isLoading: false,
  searchCardNumber: "",
  searchOwner: "",
  setCards: (cards) => set({ cards }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSearchCardNumber: (searchCardNumber) => set({ searchCardNumber }),
  setSearchOwner: (searchOwner) => set({ searchOwner }),

  getCardsWithPagination: async (params?: GetCardsParams) => {
    const state = get();
    try {
      set({ isLoading: true });

      const query = new URLSearchParams();

      const pageToLoad = params?.page ?? state.currentPage;
      const filter = params?.filter ?? state.currentFilter;
      const searchCardNumber = params?.searchCardNumber ?? state.searchCardNumber;
      const searchOwner = params?.searchOwner ?? state.searchOwner;
      const limit = params?.limit ?? state.itemsPerPage;

      query.append("page", pageToLoad.toString());
      query.append("limit", limit.toString());
      query.append("filter", filter);
      if (searchCardNumber) query.append("searchCardNumber", searchCardNumber);
      if (searchOwner) query.append("searchOwner", searchOwner);

      const response = await fetch(`/api/admin/cards?${query}`);
      const { success, data } = await response.json();

      if (success) {
        set({
          cards: data.cards,
          totalFilteredItems: data.totalFilteredItems || 0,
          totalAllItems: data.totalAllItems || 0,
          totalPages: data.totalPages || 1,
          currentPage: data.currentPage || pageToLoad,
          itemsPerPage: limit,
          ...(params?.filter && { currentFilter: params.filter }),
          ...(params?.searchCardNumber && {
            searchCardNumber: params.searchCardNumber,
          }),
          ...(params?.searchOwner && { searchOwner: params.searchOwner }),
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки карт: ", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // pagination
  totalFilteredItems: 0,
  totalPages: 0,
  totalAllItems: 0,
  currentPage: 1,
  itemsPerPage: CARDS_CONFIG.ITEMS_PER_PAGE,
  setTotalFilteredItems: (totalFilteredItems) => set({ totalFilteredItems }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setTotalAllItems: (totalAllItems) => set({ totalAllItems }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
  //

  // filters
  currentFilter: "all",
  setCurrentFilter: (currentFilter) => set({ currentFilter }),
  resetFilters: () =>
    set({
      currentFilter: "all",
      searchCardNumber: "",
      searchOwner: "",
      currentPage: 1,
    }),
  //

  clearStore: () =>
    set({
      cards: [],
      totalFilteredItems: 0,
      totalPages: 0,
      totalAllItems: 0,
      isLoading: false,
      currentPage: 1,
      itemsPerPage: 50,
      currentFilter: "all",
      searchCardNumber: "",
      searchOwner: "",
    }),
}));
