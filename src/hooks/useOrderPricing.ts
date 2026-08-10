import { useMemo } from "react";

import { CONFIG } from "../../config/config";
import { UseOrderPricingResult } from "@/types/hooks/useOrderPricing";
import { CurrentProduct, Order, ProductsData } from "@/types/order";
import { CustomCartItem, CustomPricing } from "@/types/cart";

export const useOrderPricing = (
  order: Order,
  currentProducts: CurrentProduct[],
): UseOrderPricingResult => {
  const cartItemsForSummary: CustomCartItem[] = useMemo(() => 
    order.items.map(item => {
      const currentProduct = currentProducts.find(p => p.id === item.productId)
      if (!currentProduct) {
        return {
          ...item,
          discountPercent: item.discountPercent || 0,
          hasLoyaltyDiscount: item.hasLoyaltyDiscount || false,
          addedAt: new Date()
        }
      }

      const priceAfterDiscount = currentProduct.basePrice * (1 - (currentProduct.discountPercent || 0) / 100)

      return {
        ...item,
        price: priceAfterDiscount,
        discountPercent: currentProduct.discountPercent || 0,
        hasLoyaltyDiscount: currentProduct.hasLoyaltyDiscount || false,
        addedAt: new Date()
      }
    }), [order.items, currentProducts])

  const productsPricingData: ProductsData = useMemo(() => 
    currentProducts.reduce((acc, curr) => {
      acc[curr.id] = {
        basePrice: curr.basePrice,
        discountPercent: curr.discountPercent || 0,
        hasLoyaltyDiscount: curr.hasLoyaltyDiscount || false,
      }

      return acc
    }, {} as ProductsData), [currentProducts])

  const customPricing: CustomPricing = useMemo(() => {
    const totalAfterProductDiscounts = cartItemsForSummary.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
    
    const finalTotal = cartItemsForSummary.reduce((acc, curr) => {
      const finalPrice = curr.hasLoyaltyDiscount ? curr.price * (1 - CONFIG.CARD_DISCOUNT_PERCENT / 100) : curr.price
      return acc + finalPrice * curr.quantity
    }, 0)

    const totalDiscount = totalAfterProductDiscounts - finalTotal

    const totalBonuses = Math.floor((finalTotal * CONFIG.MAX_BONUSES_PERCENTAGE) / 100)

    return {
      totalPrice: totalAfterProductDiscounts,
      totalMaxPrice: totalAfterProductDiscounts,
      totalDiscount,
      finalPrice: finalTotal,
      totalBonuses,
      maxBonusAmount: 0,
      isMinimumReached: true,
    }
  }, [cartItemsForSummary])

  return { cartItemsForSummary, productsData: productsPricingData, customPricing }
};
