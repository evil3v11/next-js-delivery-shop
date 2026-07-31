import { create } from "zustand";

import { CartItem } from "@/types/cartItem";

interface CartState {
  cart: CartItem[];
  totalItems: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  updateCart: (items: CartItem[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  totalItems: 0,
  isLoading: false,
  fetchCart: async (): Promise<void> => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Ошибка получения товаров из корзины");
      const items: CartItem[] = await response.json();
      const quantityOfAllItemsInCart = items.reduce((acc, curr) => acc += curr.quantity, 0)
      set({ cart: items, totalItems: quantityOfAllItemsInCart, isLoading: false });
    } catch (e) {
      console.error("Ошибка загрузки корзины: ", e);
      set({ cart: [], totalItems: 0, isLoading: false });
    }
  },
  updateCart: (items: CartItem[]): void => {
    const quantity = items.reduce((acc, curr) => acc += curr.quantity, 0)
    set({ cart: items, totalItems: quantity });
  },
  clearCart: (): void => set({ cart: [], totalItems: 0 }),
}));
