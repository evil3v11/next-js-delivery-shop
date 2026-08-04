import { create } from "zustand";

import { CartState, PricingState } from "@/types/storeState";
import { CartItem } from "@/types/cart";

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  totalItems: 0,
  isLoading: false,
  pricing: {
    totalPrice: 0,
    totalMaxPrice: 0,
    totalDiscount: 0,
    finalPrice: 0,
    maxBonusUse: 0,
    totalBonuses: 0,
    isMinimumReached: false,
  },
  isCheckout: false,
  isOrdered: false,
  hasLoyaltyCard: false,
  doesUseBonuses: false,
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
  updatePricing: (pricing: PricingState): void => set({ pricing }),
  setIsCheckout: (isCheckout: boolean): void => set({ isCheckout }),
  setIsOrdered: (isOrdered: boolean): void => set({ isOrdered }),
  setHasLoyaltyCard: (hasLoyaltyCard: boolean): void => set({ hasLoyaltyCard }),
  setDoesUseBonuses: (doesUseBonuses: boolean): void => set({ doesUseBonuses }),
}));
