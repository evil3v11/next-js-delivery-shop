"use client";

import { useEffect, useMemo, useState } from "react";
import { useGetAdminOrdersQuery } from "@/store/redux/api/ordersApi";

import { getDates } from "../delivery-schedule/_utils/getDates";

import Loader from "@/components/Loader";
import ErrorComponent from "@/components/ErrorComponent";
import AdminOrdersHeader from "./_components/AdminOrdersHeader";
import DateSelector from "./_components/DateSelector";
import TimeSlotSection from "./_components/TimeSlotSection";

const dates = getDates();

const AdminOrderPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [customDate, setCustomDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    data,
    isLoading,
    error: queryError,
  } = useGetAdminOrdersQuery(undefined, {
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const orders = useMemo(() => data?.orders || [], [data?.orders]);
  const stats = useMemo(() => data?.stats || null, [data?.stats]);

  useEffect(() => {
    if (orders.length > 0 && !selectedDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedDate(dates[0]);
    }
  }, [orders.length, selectedDate]);

  const filteredOrdersIds = useMemo(() => {
    if (!orders.length) return [];
    const targetDate = selectedDate || getDates()[0];
    return orders.filter((o) => o.deliveryTime.date === targetDate).map(o => String(o._id));
  }, [selectedDate, orders]);

  const handleDateSelect = (date: Date | undefined): void => {
    setCustomDate(date);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateAsString = `${year}-${month}-${day}`;

      setSelectedDate(dateAsString);
    }
    setIsCalendarOpen(false);
  };

  const toggleCalendar = (): void => setIsCalendarOpen(!isCalendarOpen);

  const filterOrdersByDate = (date: string): void => {
    setSelectedDate(date);
    setCustomDate(undefined);
    setIsCalendarOpen(false);
  };

  if (isLoading) return <Loader />;

  if (queryError) {
    return (
      <ErrorComponent
        error={queryError instanceof Error ? queryError : new Error("Ошибка")}
        userMessage="Не удалось получить заказы пользователя"
      />
    );
  }

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] mx-auto mb-8 py-8">
      <AdminOrdersHeader stats={stats} />
      <DateSelector
        orders={orders}
        dates={dates}
        selectedDate={selectedDate}
        customDate={customDate}
        onDateSelect={filterOrdersByDate}
        isCalendarOpen={isCalendarOpen}
        toggleCalendar={toggleCalendar}
        onCalendarDateSelect={handleDateSelect}
      />
      <TimeSlotSection orderIds={filteredOrdersIds} />
    </div>
  );
};

export default AdminOrderPage;
