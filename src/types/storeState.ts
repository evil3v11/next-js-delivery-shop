import { CartItem } from "./cart";
import { UserDataOrNull } from "./userData";

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
  maxBonusUse: number;
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
