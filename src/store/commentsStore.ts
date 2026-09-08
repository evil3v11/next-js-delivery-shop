import { create } from "zustand";
import { CommentsState } from "@/types/store/storeState";
import { CMS_CONFIG } from "@/app/(admin)/admin/(cms)/cms/cms_config";

export const useCommentsStore = create<CommentsState>((set, get) => ({
  comments: [],
  isLoading: true,
  bannedUsers: {},
  setComments: (comments) => set({ comments }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setBannedUsers: (userId, isBanned, bannedUntil) =>
    set((state) => ({
      bannedUsers: {
        ...state.bannedUsers,
        [userId]: {
          isBanned,
          bannedUntil: bannedUntil ?? null,
        },
      },
    })),
  fetchCommentsWithPagination: async (params) => {
    try {
      set({ isLoading: true });
      const state = get();
      const query = new URLSearchParams();

      const page = params?.page ?? state.currentPage;
      const dateFrom = params?.dateFrom ?? "";
      const dateTo = params?.dateTo ?? "";
      const author = params?.author ?? "";
      const article = params?.article ?? "";

      query.append("page", String(page));
      query.append("limit", String(state.itemsPerPage));
      if (dateFrom) query.append("dateFrom", dateFrom);
      if (dateTo) query.append("dateTo", dateTo);
      if (author) query.append("author", author);
      if (article) query.append("article", article);

      const response = await fetch(`/admin/cms/api/comments?${query}`);
      const { success, data } = await response.json();
      if (response.ok && success) {
        set({
          comments: data.comments,
          totalAllItems: data.totalAllItems,
          totalFilteredItems: data.totalFilteredItems,
          totalPages: data.totalPages,
          currentPage: Number(page),
        });
      }
    } catch (e) {
      console.error("Ошибка при получении комментариев: ", e);
    } finally {
      set({ isLoading: false });
    }
  },

  // pagination
  totalAllItems: 0,
  totalFilteredItems: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: CMS_CONFIG.COMMENTS_PER_PAGE,
  setTotalAllItems: (totalAllItems) => set({ totalAllItems }),
  setTotalFilteredItems: (totalFilteredItems) => set({ totalFilteredItems }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
  //
}));
