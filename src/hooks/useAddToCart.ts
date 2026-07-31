import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

import { CONFIG } from "../../config/config";
import { addToCartAction } from "@/actions/addToCartAction";
import { removeMultipleItemsAction, updateItemQuantityAction } from "@/actions/cartActions";

export const useAddToCart = (productId: string) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [message, setMessage] = useState<{success: boolean; message: string; } | null>(null);
  const { cart, updateCart, fetchCart } = useCartStore()
  
  useEffect(() => {
    const messageTimeout = setTimeout(() => setMessage(null), CONFIG.MESSAGE_TIMEOUT_DELAY)
    return () => clearTimeout(messageTimeout)
  }, [message])

  const cartItem = cart.find(i => i.productId === productId) 
  const currentQuantity = cartItem?.quantity || 0
  const isInCart = currentQuantity > 0

  const addToCart = async () => {
    try {
      setIsAdding(true);
      setMessage(null);

      const addToCartResult = await addToCartAction(productId);
      if (addToCartResult.success && addToCartResult.message) setMessage(addToCartResult);
      if (addToCartResult.success) await fetchCart()
    } catch {
      setMessage({ success: false, message: "Ошибка при добавлении товара в корзину" });
    } finally {
      setIsAdding(false);
    }
  };

  const updateQuantity = async (newQuantity: number): Promise<void> => {
    if (newQuantity < 0) return 

    try {
      setIsAdding(true)

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

  const closeMessage = (): void => setMessage(null)

  return { 
    message, 
    isAdding, 
    currentQuantity, 
    isInCart, 
    addToCart, 
    incrementQuantity, 
    decrementQuantity, 
    closeMessage
  };
};
