"use client";

import { useEffect, useState } from "react";
import { useGetAdminOrdersQuery } from "@/store/redux/api/ordersApi";

import { getUniqueCities } from "../_utils/getUniqueCities";

import { Order } from "@/types/order";

import Image from "next/image";
import CityFilterButtons from "./CityFilterButtons";
import AdminOrderCard from "./AdminOrderCard";

interface TimeSlotGroupProps {
  timeSlot: string;
  orderIds: string[];
}

const TimeSlotGroup = ({ timeSlot, orderIds }: TimeSlotGroupProps) => {
  const { data } = useGetAdminOrdersQuery()
  const [selectedCity, setSelectedCity] = useState("Все города");
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (data?.orders) {
      const filteredOrders = data.orders.filter(o => orderIds.includes(String(o._id)))
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalOrders(filteredOrders)
    }
  }, [data?.orders, orderIds]);

  const startTime = timeSlot.split("-")[0];
  const cities = getUniqueCities(localOrders);

  const filteredSlotOrders =
    selectedCity === "Все города"
      ? localOrders
      : localOrders.filter((order) => order.deliveryAddress.city === selectedCity);

  const completedOrdersAmount = filteredSlotOrders.filter((o) => o.status === "confirmed").length;

  const handleCitySelect = (city: string) => setSelectedCity(city);

  return (
    <div key={timeSlot}>
      <div className="flex justify-between text-xl md:text-2xl xl:text-4xl text-main-text">
        <div className="flex gap-x-4 mb-4">
          <Image
            alt={timeSlot}
            src="/icons-orders/icon-clock.svg"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="font-bold">{startTime}</span>
        </div>
        <div className="flex gap-x-2.5 items-center">
          <Image
            alt={timeSlot}
            src="/icons-orders/icon-check.svg"
            width={24}
            height={24}
          />
          <div>
            <span className="text-2xl">{completedOrdersAmount}</span>
            <span className="text-xl">{" / "}</span>
            <span className="text-2xl">{filteredSlotOrders.length}</span>
          </div>
        </div>
      </div>
      {cities.length > 1 && (
        <CityFilterButtons
          cities={cities}
          slotOrders={localOrders}
          selectedCity={selectedCity}
          onCitySelect={handleCitySelect}
        />
      )}
      <div className="flex flex-col gap-y-15">
        {filteredSlotOrders.map((order) => (
          <AdminOrderCard
            key={String(order._id)}
            orderId={String(order._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeSlotGroup;
