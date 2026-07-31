import { useCallback, useState } from "react";
import { useCartStore } from "@/store/cartStore";

import {
  getCartAction,
  getUserBonusesAction,
  removeMultipleItemsAction,
  updateItemQuantityAction,
} from "@/actions/cartActions";

import { ProductCardProps } from "@/types/product";
import { CartItem } from "@/types/cart";

export const useCartActions = () => {
  const [productData, setProductData] = useState<Record<string, ProductCardProps>>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [isCartLoading, setIsCartLoading] = useState<boolean>(true);
  
  const [hasLoyaltyCard, setHasLoyaltyCard] = useState<boolean>(false);
  const [bonusesAmount, setBonusesAmount] = useState<number>(0);
  const { cart, updateCart } = useCartStore();

  const fetchCartAndProducts = async (): Promise<void> => {
    try {
      setIsCartLoading(true);

      const { bonusesAmount, hasLoyaltyCard } = await getUserBonusesAction();
      setBonusesAmount(bonusesAmount);
      setHasLoyaltyCard(hasLoyaltyCard);

      const itemsInCart = await getCartAction();
      updateCart(itemsInCart);

      const productPromises = itemsInCart.map(async ({ productId }) => {
        try {
          const response = await fetch(`/api/products/${productId}`);
          const product = await response.json();
          return { productId, product };
        } catch {
          console.error(`Ошибка получения продукта ${productId}`);
          return null;
        }
      });

      const productsResults = await Promise.all(productPromises);
      const productsMap: Record<string, ProductCardProps> = {};

      for (const result of productsResults) {
        if (result && result.product)
          productsMap[result.productId] = result.product;
      }

      setProductData(productsMap);
    } catch (e) {
      console.error("Ошибка при получения данных из корзины: ", e);
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleQuantityUpdate = async (productId: string, newQuantity: number): Promise<void> => {
    const updatedItemsInCart = cart.map((i) => i.productId === productId ? { ...i, quantity: newQuantity } : i);
    updateCart(updatedItemsInCart);

    try {
      await updateItemQuantityAction(productId, newQuantity);
    } catch (e) {
      console.error("Ошибка при обновлении количества продуктов: ", e);
      updateCart(cart);
    }
  };

  const handleRemoveSelected = async () => {
    if (!selectedItems.length) return;
    setRemovedItems((prev) => [...prev, ...selectedItems]);

    const updatedItemsInCart = cart.filter((item) => !selectedItems.includes(item.productId));
    updateCart(updatedItemsInCart);

    try {
      removeMultipleItemsAction(selectedItems);
      setSelectedItems([]);
    } catch (e) {
      console.error("Ошибка при удалении товаров: ", e);
      setRemovedItems((prev) => prev.filter((id) => !selectedItems.includes(id)));
      updateCart(cart);
    }
  };

  const selectAllItems = (visibleItems: CartItem[]) => setSelectedItems(visibleItems.map((i) => i.productId));
  const unselectAllItems = () => setSelectedItems([]);

  const handleItemSelection = useCallback((productId: string, isSelected: boolean): void => {
    if (isSelected) setSelectedItems((prev) => [...prev, productId]);
    else setSelectedItems((prev) => prev.filter((id) => id !== productId));
  }, []);

  return {
    isCartLoading,
    bonusesAmount,
    hasLoyaltyCard,
    productData,
    removedItems,
    selectedItems,
    fetchCartAndProducts,
    handleQuantityUpdate,
    handleRemoveSelected,
    selectAllItems,
    unselectAllItems,
    handleItemSelection,
  };
};
