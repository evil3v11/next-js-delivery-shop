"use client";

import { useCallback, useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCartActions } from "@/hooks/useCartActions";
import { useCartPrices } from "@/hooks/useCartPrices";

import { DeliveryAddress, DeliveryTime } from "@/types/order";

import Loader from "@/components/Loader";
import CartControls from "./_components/CartControls";
import CartHeader from "./_components/CartHeader";
import CartItem from "./_components/CartItem";
import CartSidebar from "./_components/CartSidebar";
import CheckoutForm from "./_components/CheckoutForm";

const CartPage = () => {
  const [title, setTitle] = useState<string>("Корзина");
  const [deliveryData, setDeliveryData] = useState<{
    address: DeliveryAddress;
    time: DeliveryTime;
    isValid: boolean;
  } | null>(null);
  const {
    cart,
    isCheckout,
    isOrdered,
    hasLoyaltyCard,
    doesUseBonuses,
    pricing,
  } = useCartStore();
  const {
    isCartLoading,
    productsData,
    removedItems,
    selectedItems,
    areAllItemsSelected,
    fetchCartAndProducts,
    handleQuantityUpdate,
    handleRemoveSelected,
    selectAllItems,
    unselectAllItems,
    handleItemSelection,
  } = useCartActions();

  useEffect(() => {
    fetchCartAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(isCheckout ? "Доставка" : "Корзина");
  }, [isCheckout]);

  const visibleItems = cart.filter((i) => !removedItems.includes(i.productId));
  const availableItems = visibleItems.filter((item) => {
    const product = productsData[item.productId];
    return product && product.quantity > 0;
  });

  useCartPrices(
    availableItems,
    productsData,
    hasLoyaltyCard,
    doesUseBonuses,
    pricing.totalBonuses,
  );

  const handleFormDataChange = useCallback(
    (deliveryData: {
      address: DeliveryAddress;
      time: DeliveryTime;
      isValid: boolean;
    }): void => setDeliveryData(deliveryData),
    [],
  );

  const sidebarProps = { deliveryData, productsData };

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
    <div
      className="px-[max(12px,calc((100%-1208px)/2))] md:px-[max(16px,calc((100%-1208px)/2))] mx-auto mb-10
    text-main-text"
    >
      <CartHeader itemCount={visibleItems.length} title={title} />
      <div className="flex flex-col md:flex-row gap-8 xl:gap-x-15">
        <div
          className={`flex-1 ${isOrdered ? "pointer-events-none opacity-50" : ""}`}
        >
          {!isCheckout ? (
            <>
              <CartControls
                areAllItemsSelected={areAllItemsSelected}
                selectedItemsCount={selectedItems.length}
                onSelectAll={() => selectAllItems(visibleItems)}
                onUnselectAll={unselectAllItems}
                onRemoveSelected={handleRemoveSelected}
              />
              <div className="flex flex-col gap-y-6 lg:min-w-218.5">
                {visibleItems.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    productData={productsData[item.productId]}
                    isSelected={selectedItems.includes(item.productId)}
                    onSelectionChange={handleItemSelection}
                    onQuantityUpdate={handleQuantityUpdate}
                  />
                ))}
              </div>
            </>
          ) : (
            <CheckoutForm onFormDataChange={handleFormDataChange} />
          )}
        </div>
        <CartSidebar {...sidebarProps} />
      </div>
    </div>
  );
};

export default CartPage;
