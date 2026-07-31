import {
  calculateFinalPrice,
  calculatePriceByCard,
} from "@/utils/calculateProductPrice";
import { CONFIG } from "../../config/config";

import { CartItem } from "@/types/cart";
import { ProductCardProps } from "@/types/product";

export const useCartPrices = (
  items: CartItem[],
  productData: Record<string, ProductCardProps>,
  hasLoyaltyCard: boolean,
  doesUseBonuses: boolean,
  bonusesAmount: number,
): Record<string, number> => {
  // total price of all items with card discount
  const totalPrice = items.reduce((acc, curr) => {
    const product = productData[curr.productId];
    if (!product) return acc;

    const discountedPrice = calculateFinalPrice(product.basePrice, product.discountPercent || 0);
    const finalPrice = hasLoyaltyCard
      ? calculatePriceByCard(discountedPrice, CONFIG.CARD_DISCOUNT_PERCENT)
      : discountedPrice;

    return acc + finalPrice * curr.quantity;
  }, 0);

  // total price of all items without card discount
  const totalMaxPrice = items.reduce((acc, curr) => {
    const product = productData[curr.productId];
    if (!product) return acc;

    const discountedPrice = calculateFinalPrice(product.basePrice, product.discountPercent || 0);

    return acc + discountedPrice * curr.quantity;
  }, 0);

  // total amount of discount for all items
  const totalDiscount = items.reduce((acc, curr) => {
    const product = productData[curr.productId];
    if (!product) return acc;

    const discountedPrice = calculateFinalPrice(product.basePrice, product.discountPercent || 0);

    const finalPrice = hasLoyaltyCard
      ? calculatePriceByCard(discountedPrice, CONFIG.CARD_DISCOUNT_PERCENT)
      : discountedPrice;

    const itemDiscount = (discountedPrice - finalPrice) * curr.quantity;

    return acc + itemDiscount;
  }, 0);

  // maximum amount of bonuses that can be used up is 30% of total price of all items
  const maxBonusAmount = Math.min(
    bonusesAmount,
    Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENTAGE) / 100),
  );

  const finalPrice = doesUseBonuses
    ? Math.max(0, totalPrice - maxBonusAmount)
    : totalPrice;

  // amount of bonus points that customer receives after purchase
  const totalBonuses = items.reduce((acc, curr) => {
    const product = productData[curr.productId];
    if (!product) return acc;

    const discountedPrice = calculateFinalPrice(product.basePrice, product.discountPercent || 0);

    const bonusesAmount = Math.round((discountedPrice * CONFIG.PRODUCT_BONUSES_PERCENT) / 100);

    return acc + bonusesAmount * curr.quantity;
  }, 0);

  return { totalPrice, totalMaxPrice, totalDiscount, finalPrice, totalBonuses };
};
