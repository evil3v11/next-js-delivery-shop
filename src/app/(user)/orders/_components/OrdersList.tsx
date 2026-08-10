"use client";

import { useState } from "react";

import { CONFIG } from "../../../../../config/config";

import { Order } from "@/types/order";

import OrderCard from "./OrderCard";

const OrdersList = ({ orders }: { orders: Order[] }) => {
  const [visibleOrdersAmount, setVisibleOrdersAmount] = useState(CONFIG.ITEMS_PER_ORDERS_PAGE);

  const visibleOrders = orders.slice(0, visibleOrdersAmount)
  const hasMoreOrders = orders.length > visibleOrdersAmount

  const handleShowMore = () => setVisibleOrdersAmount((prev) => prev + CONFIG.ITEMS_PER_ORDERS_PAGE)

  return (
    <div>
      <div className="space-y-30">
        {visibleOrders.map((order) => (
          <OrderCard key={String(order._id)} order={order} />
        ))}
      </div>
      {hasMoreOrders && (
        <div className="flex justify-center mt-15">
          <button
            onClick={handleShowMore}
            className="bg-[#f3f2f1] hover:shadow-button-secondary text-main-text w-50 h-10 px-2 flex 
            justify-center items-center gap-2 rounded duration-300 cursor-pointer"
          >
            Показать еще
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
