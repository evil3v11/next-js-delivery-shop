"use client";

import { Activity, useEffect, useState } from "react";
import { useOrderProductsData } from "@/hooks/useOrderProductsData";
import { useOrderProducts } from "@/hooks/useOrderProducts";
import { usePriceComparison } from "@/hooks/usePriceComparison";
import { useOrderPricing } from "@/hooks/useOrderPricing";
import { useDeliveryData } from "@/hooks/useDeliveryData";
import { useRepeatOrder } from "@/hooks/useRepeatOrder";

import { Order } from "@/types/order";

import OrderHeader from "./OrderHeader";
import DeliveryDatePicker from "./DeliveryDatePicker";
import ProductsSection from "@/app/(products)/ProductsSection";
import OrderActions from "./OrderActions";
import MiniLoader from "@/components/MiniLoader";
import OrderDetails from "./OrderDetails";
import StockWarning from "./StockWarning";
import RepeatOrderSection from "./RepeatOrderSection";
import RepeatOrderSuccessMessage from "./RepeatOrderSuccessMessage";

const OrderCard = ({ order }: { order: Order }) => {
  const [showOrderDetails, setShowOrderDetails] = useState<boolean>(false);
  const [showPriceWarning, setShowPriceWarning] = useState<boolean>(false);

  const { productsData: fetchedProductsData, isProductsDataLoading } =
    useOrderProductsData(order);
  const { orderProducts, stockWarnings } = useOrderProducts(
    order,
    fetchedProductsData,
  );
  const { currentProducts, priceComparison } = usePriceComparison(
    order,
    fetchedProductsData,
  );
  const { cartItemsForSummary, productsData, customPricing } = useOrderPricing(
    order,
    currentProducts,
  );
  const { deliverySchedule } = useDeliveryData();
  const {
    selectedDelivery,
    showDatePicker,
    showDeliveryButton,
    isRepeatOrderCreated,
    handleDeliveryClick,
    handleOrderClick,
    handleDateSelect,
    handleCancelDelivery,
    handleEditDelivery,
    handleReorderSuccess,
  } = useRepeatOrder();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (priceComparison?.hasChanges) setShowPriceWarning(true);
  }, [priceComparison?.hasChanges]);

  const hasStockIssues = orderProducts.some(
    (p) => p.isLowStock || p.isInsufficientStock,
  );
  const canReorder = !hasStockIssues;

  const applyIndexStyle = !showOrderDetails;

  if (isProductsDataLoading) return <MiniLoader />;

  return (
    <div className="text-main-text">
      <OrderHeader
        order={order}
        showDeliveryButton={showDeliveryButton}
        onOrderClick={handleOrderClick}
        onDeliveryClick={handleDeliveryClick}
        disabled={hasStockIssues}
      />
      <ProductsSection
        products={orderProducts}
        applyIndexStyle={applyIndexStyle}
        isOrderCard={true}
      />
      <RepeatOrderSection
        isRepeatOrderCreated={isRepeatOrderCreated}
        selectedDelivery={selectedDelivery}
        canReorder={canReorder}
        order={order}
        priceComparison={priceComparison}
        showPriceWarning={showPriceWarning}
        onClosePriceWarning={() => setShowPriceWarning(false)}
        deliveryData={selectedDelivery}
        onEditDelivery={handleEditDelivery}
        productsData={productsData}
        cartItemsForSummary={cartItemsForSummary}
        customPricing={customPricing}
        onOrderSuccess={handleReorderSuccess}
      />
      <StockWarning warnings={stockWarnings} hasStockIssues={hasStockIssues} />
      {isRepeatOrderCreated && <RepeatOrderSuccessMessage />}
      <OrderActions
        showOrderDetails={showOrderDetails}
        onToggleDetails={() => setShowOrderDetails(!showOrderDetails)}
      />
      {showOrderDetails && <OrderDetails order={order} />}
      <Activity mode={showDatePicker ? "visible" : "hidden"}>
        <DeliveryDatePicker
          schedule={deliverySchedule}
          isCreatingOrder={false}
          onDateSelect={(date, timeSlot) =>
            handleDateSelect(date, timeSlot, order.deliveryAddress)
          }
          onCancel={handleCancelDelivery}
        />
      </Activity>
    </div>
  );
};

export default OrderCard;
