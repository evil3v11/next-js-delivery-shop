import { create } from "zustand";
import { DnDState } from "@/types/store/storeState";

export const useDnDStore = create<DnDState>((set) => ({
  draggedId: null,
  draggedOverId: null,
  tempOrder: new Map(),
  isReordering: false,
  setDraggedId: (draggedId) => set({ draggedId }),
  setDraggedOverId: (draggedOverId) => set({ draggedOverId }),
  setTempOrder: (tempOrder) => set({ tempOrder }),
  setIsReordering: (isReordering) => set({ isReordering }),
  reorderItems: async (items, itemType) => {
    try {
      set({ isReordering: true })
      const response = await fetch("/api/admin/dnd-reorder", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items, itemType }),
      });
      return await response.json();
    } catch (e) {
      console.error("Ошибка при изменении порядка предметов: ", e);
      return {
        success: false,
        message: `Ошибка при изменении порядка предметов: ${e}`,
      };
    } finally {
      set({ isReordering: false })
    }
  },
  resetDnDStore: () => set({ draggedId: null, draggedOverId: null, tempOrder: new Map() }),
}));
