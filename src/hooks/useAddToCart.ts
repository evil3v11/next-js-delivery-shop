import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

import { CONFIG } from "../../config/config";
import { addToCartAction } from "@/actions/addToCartAction";
import { removeMultipleItemsAction, updateItemQuantityAction } from "@/actions/cartActions";

export const useAddToCart = (productId: string, availableQuantity: number) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [tooltipMessage, setTooltipMessage] = useState<string>("");
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const { cart, updateCart, fetchCart } = useCartStore()
  
  useEffect(() => {
    const messageTimeout = setTimeout(() => setTooltipMessage(""), CONFIG.MESSAGE_TIMEOUT_DELAY)
    return () => clearTimeout(messageTimeout)
  }, [tooltipMessage])

  const cartItem = cart.find(i => i.productId === productId) 
  const currentQuantity = cartItem?.quantity || 0
  const isInCart = currentQuantity > 0
  const isOutOfStock = availableQuantity === 0;
  const displayQuantity = Math.min(currentQuantity, availableQuantity);
  const hasReachedMaxQuantity = displayQuantity > availableQuantity;

  const showMessage = (message: string): void => {
    setTooltipMessage(message)
    setShowTooltip(true)
    setTimeout(() => setShowTooltip(false), 3000)
  }

  const addToCart = async () => {
    if (hasReachedMaxQuantity) {
      showMessage(`Осталось ${availableQuantity} шт. этого продукта`)
      return
    }

    try {
      setIsAdding(true);
      setTooltipMessage("");

      const addToCartResult = await addToCartAction(productId);
      if (addToCartResult.success && addToCartResult.message) setTooltipMessage(addToCartResult.message);
      if (addToCartResult.success) await fetchCart()
    } catch {
      showMessage("Ошибка при добавлении товара в корзину");
    } finally {
      setIsAdding(false);
    }
  };

  const updateQuantity = async (newQuantity: number): Promise<void> => {
    if (newQuantity < 0) return
    if (newQuantity > availableQuantity) {
      showMessage(`Осталось ${availableQuantity} шт. этого продукта`)
      return
    }

    try {
      setIsAdding(true)
      setShowTooltip(false)

      let updatedCartItems;
      if (newQuantity === 0) {
        updatedCartItems = cart.filter((item) => item.productId === productId)
        updateCart(updatedCartItems)
        await removeMultipleItemsAction([productId])
      } else {
        updatedCartItems = cart.map((item) => 
          item.productId === productId
            ? {...item, quantity: newQuantity}
            : item
        )
        await updateItemQuantityAction(productId, newQuantity)
      }

      await fetchCart()
    } catch (e) {
      console.error("Ошибка при обновлении количества продуктов: ", e);
      await fetchCart();
    } finally {
      setIsAdding(false)
    }
  };

  const incrementQuantity = (): Promise<void> => updateQuantity(currentQuantity + 1)
  const decrementQuantity = (): Promise<void> => updateQuantity(Math.max(0, currentQuantity - 1))

  // const closeMessage = (): void => setTooltipMessage('')

  return { 
    tooltipMessage, 
    isAdding, 
    displayQuantity,
    isInCart,
    hasReachedMaxQuantity,
    isOutOfStock,
    showTooltip,
    addToCart, 
    incrementQuantity, 
    decrementQuantity, 
    showMessage,
  };
};
