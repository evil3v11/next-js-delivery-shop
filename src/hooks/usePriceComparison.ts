import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/authStore";

import { CONFIG } from "../../config/config";

import { CurrentProduct, Order, PriceComparison } from "@/types/order";
import { ProductCardProps } from "@/types/product";
import { UsePriceComparisonResult } from "@/types/hooks/usePriceComparison";

export const usePriceComparison = (
  order: Order,
  productsData: ProductCardProps[],
): UsePriceComparisonResult => {
  const [priceComparison, setPriceComparison] = useState<PriceComparison | null>(null)
  const { user } = useAuthStore()

  const hasLoyaltyCard = !!(user?.card && user.hasNoCard)
  
  const currentProducts = useMemo(() => {
    if (!productsData.length) return []

    return order.items
      .map((item) => {
        const product = productsData.find((p) => String(p.id) === item.productId)
        if (!product) return null

        const discountMultiplier = 1 - (product.discountPercent || 0) / 100
        let finalPrice = Math.round(product.basePrice * discountMultiplier * 100) / 100
        if (hasLoyaltyCard) finalPrice *= (1 - CONFIG.CARD_DISCOUNT_PERCENT / 100)
        
        return {
          id: item.productId,
          price: finalPrice,
          basePrice: product.basePrice,
          discountPercent: product.discountPercent,
          hasLoyaltyDiscount: hasLoyaltyCard,
          title: product.title
        } as CurrentProduct
      })
      .filter((product) => product !== null)
  }, [productsData, order.items, hasLoyaltyCard])

  const comparePrises = useCallback(() => {
    if (!currentProducts.length)  {
      setPriceComparison(null)
      return
    }

    const changedItems: PriceComparison["changedItems"] = []
    let hasAnyChanges = false
    let currentTotal = 0

    for (const item of order.items) {
      const currentProduct = currentProducts.find(p => p.id === item.productId)
      if (currentProduct) {
        currentTotal += currentProduct.price * item.quantity

        const originalPriceWithoutLoyalty = item.hasLoyaltyDiscount
          ? item.price / (1 - CONFIG.CARD_DISCOUNT_PERCENT / 100)
          : item.price

        const currentPriceWithoutLoyalty = currentProduct.hasLoyaltyDiscount
          ? currentProduct.price / (1 - CONFIG.CARD_DISCOUNT_PERCENT / 100)
          : currentProduct.price

        const didPriceChanged = Math.abs(originalPriceWithoutLoyalty - currentPriceWithoutLoyalty) > 0.01
        const didDiscountChanged = (item.discountPercent || 0) !== (currentProduct.discountPercent || 0)
        const didLoyaltyStatusChanged = item.hasLoyaltyDiscount !== currentProduct.hasLoyaltyDiscount

        if (didPriceChanged || didDiscountChanged || didLoyaltyStatusChanged) {
          changedItems.push({
            productId: item.productId,
            productName: currentProduct.title,
            originalPrice: originalPriceWithoutLoyalty,
            currentPrice: currentPriceWithoutLoyalty,
            quantity: item.quantity,
            didPriceChanged,
            didDiscountChanged,
            didLoyaltyStatusChanged,
            originalDiscount: item.discountPercent || 0,
            currentDiscount: currentProduct.discountPercent || 0,
            originalHasLoyalty: item.hasLoyaltyDiscount || false,
            currentHasLoyalty: currentProduct.hasLoyaltyDiscount || false,
          })
          hasAnyChanges = true
        }
      }
    }

    const originalTotal = order.totalAmount
    const totalDifference = currentTotal - originalTotal

    const hasChanges = hasAnyChanges || Math.abs(totalDifference) > 0.01

    setPriceComparison({
      hasChanges,
      originalTotal,
      currentTotal,
      difference: totalDifference,
      changedItems
    })
  }, [currentProducts, order.items, order.totalAmount])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    comparePrises()
  }, [comparePrises])

  return { priceComparison, currentProducts }
};
