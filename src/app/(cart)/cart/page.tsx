"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCartPrices } from "@/hooks/useCartPrices";
import { useCartActions } from "@/hooks/useCartActions";

import Loader from "@/components/Loader";
import CartControls from "./_components/CartControls";
import CartHeader from "./_components/CartHeader";
import CartItem from "./_components/CartItem";
import CartSidebar from "./_components/CartSidebar";

const CartPage = () => {
  const [doesUseBonuses, setDoesUseBonuses] = useState<boolean>(false);

  const { cart } = useCartStore();
  const {
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
    handleItemSelection
  } = useCartActions();

  const visibleItems = cart.filter((i) => !removedItems.includes(i.productId));
  const availableItems = visibleItems.filter((i) => {
    const product = productData[i.productId]?.quantity;
    return product && product > 0;
  });

  const { totalPrice, totalMaxPrice, totalDiscount, finalPrice, totalBonuses } =
    useCartPrices(
      availableItems,
      productData,
      hasLoyaltyCard,
      doesUseBonuses,
      bonusesAmount,
    );

  useEffect(() => {
    fetchCartAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMinimumPriceReached = finalPrice >= 1000;
  const areAllItemsSelected = selectedItems.length > 0 && selectedItems.length === visibleItems.length;

  const sidebarProps = {
    bonusesAmount,
    doesUseBonuses,
    setDoesUseBonuses,
    totalPrice,
    visibleItems,
    totalMaxPrice,
    totalDiscount,
    finalPrice,
    totalBonuses,
    isMinimumPriceReached
  }

  if (isCartLoading) return <Loader />;
  if (visibleItems.length === 0 && removedItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Корзина</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Корзина пуста</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] md:px-[max(16px,calc((100%-1208px)/2))] mx-auto mb-10
    text-main-text"
    >
      <CartHeader itemCount={visibleItems.length} />
      <CartControls
        areAllItemsSelected={areAllItemsSelected}
        selectedItemsCount={selectedItems.length}
        onSelectAll={() => selectAllItems(visibleItems)}
        onUnselectAll={unselectAllItems}
        onRemoveSelected={handleRemoveSelected}
      />
      <div className="flex flex-col md:flex-row gap-8 xl:gap-x-15">
        <div className="flex flex-col gap-y-6 lg:min-w-218.5">
          {visibleItems.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              productData={productData[item.productId]}
              isSelected={selectedItems.includes(item.productId)}
              onSelectionChange={handleItemSelection}
              onQuantityUpdate={handleQuantityUpdate}
              hasLoyaltyCard={hasLoyaltyCard}
            />
          ))}
        </div>
        <CartSidebar {...sidebarProps} />
      </div>
    </div>
  );
};

export default CartPage;
