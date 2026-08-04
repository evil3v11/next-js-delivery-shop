'use client'

import { useEffect, useMemo } from "react";
import { useCartStore } from "@/store/cartStore";

import { CONFIG } from "../../config/config";
import {
  calculateFinalPrice,
  calculatePriceByCard,
} from "@/utils/calculateProductPrice";

import { CalculatedItem, CartItem } from "@/types/cart";
import { ProductCardProps } from "@/types/product";

export const useCartPrices = (
  items: CartItem[],
  productData: Record<string, ProductCardProps>,
  hasLoyaltyCard: boolean,
  doesUseBonuses: boolean,
  bonusesAmount: number,
): Record<string, number | boolean> => {
  const { updatePricing } = useCartStore();

  const calculatedItems = useMemo(() => {
    return items
      .map((item) => {
        const product = productData[item.productId];
        if (!product) return null;

        const discountedPrice = calculateFinalPrice(product.basePrice, product.discountPercent || 0);
        const finalPrice = hasLoyaltyCard
          ? calculatePriceByCard(discountedPrice, CONFIG.CARD_DISCOUNT_PERCENT)
          : discountedPrice;

        const discountAmount = discountedPrice - finalPrice;
        const bonuses = (discountedPrice * CONFIG.MAX_BONUSES_PERCENTAGE) / 100;
        
        return {
          basePrice: product.basePrice,
          discountedPrice,
          finalPrice,
          discountAmount,
          bonuses,
          quantity: item.quantity,
        };
      })
      .filter(Boolean) as CalculatedItem[];
  }, [items, hasLoyaltyCard, productData]);

  const { totalPrice, totalMaxPrice, totalDiscount, totalBonuses } = useMemo(() => {
    return calculatedItems.reduce((acc, curr) => {
        return {
          totalPrice: acc.totalPrice + curr.finalPrice * curr.quantity,
          totalMaxPrice: acc.totalMaxPrice + curr.discountedPrice * curr.quantity,
          totalDiscount: acc.totalDiscount + curr.discountAmount * curr.quantity,
          totalBonuses: acc.totalBonuses + Math.round(curr.bonuses) * curr.quantity,
        };
      },
      {
        totalPrice: 0,
        totalMaxPrice: 0,
        totalDiscount: 0,
        totalBonuses: 0,
      },
    );
  }, [calculatedItems]);

  const maxBonusUse = Math.min(bonusesAmount, Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENTAGE) / 100));
  const finalPrice = doesUseBonuses ? Math.max(0, totalPrice - maxBonusUse) : totalPrice;
  const isMinimumReached = finalPrice >= 1000;

  useEffect(() => {
    updatePricing({
      totalPrice,
      totalMaxPrice,
      totalDiscount,
      finalPrice,
      maxBonusUse,
      totalBonuses,
      isMinimumReached,
    });
  }, [
    totalPrice,
    totalMaxPrice,
    totalDiscount,
    finalPrice,
    maxBonusUse,
    totalBonuses,
    isMinimumReached,
    updatePricing,
  ]);

  return {
    totalPrice,
    totalMaxPrice,
    totalDiscount,
    finalPrice,
    maxBonusUse,
    totalBonuses,
    isMinimumReached,
  };
};
