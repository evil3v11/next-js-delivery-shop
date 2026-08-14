"use client";

import { useEffect, useState } from "react";
import { useGetAdminOrdersQuery } from "@/store/redux/api/ordersApi";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

import { getAvailableTimeSlots } from "@/utils/getAvailableTimeSlots";
import { formatDateToLocalYYYYMMDD } from "@/utils/formatDateToLocalYYYYMMDD";
import { formatDeliveryDateTime } from "../_utils/formatDeliveryDateTime";

import type { Schedule } from "@/types/deliverySchedule";

import { buttonStyles } from "@/app/styles";

import Calendar from "./Calendar";
import Image from "next/image";

interface CalendarOrderModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CalendarOrderModal = ({
  orderId,
  isOpen,
  onClose,
}: CalendarOrderModalProps) => {
  const [scheduleData, setScheduleData] = useState<{
    schedule: Schedule;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { data } = useGetAdminOrdersQuery();

  const calendarRef = useClickOutsideModal<HTMLDivElement>(onClose);

  const order = data?.orders?.find((o) => String(o._id) === orderId);

  useEffect(() => {
    const fetchDeliverySchedule = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/delivery-schedule");
        const schedule = await response.json();
        setScheduleData(schedule);
      } catch (e) {
        console.error("Ошибка при загрузки графика доставки: ", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) fetchDeliverySchedule();
  }, [isOpen]);

  useEffect(() => {
    if (order?.deliveryTime.date) {
      const orderTime = new Date(order.deliveryTime.date);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedDate(orderTime);
    }
    if (order?.deliveryTime.timeSlot)
      setSelectedTimeSlot(order?.deliveryTime.timeSlot);
  }, [order?.deliveryTime.date, order?.deliveryTime.timeSlot]);

  const availableTimeSlots =
    scheduleData?.schedule && selectedDate
      ? getAvailableTimeSlots(selectedDate, scheduleData.schedule)
      : [];

  const handleDateSelect = (date: Date | undefined): void => {
    if (date) {
      setSelectedDate(date);
      setSelectedTimeSlot("");
    }
  };

  const updateOrderDeliveryTime = async () => {
    if (!orderId || !selectedTimeSlot) {
      alert("Выберите временной слот");
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/delivery-time`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            deliveryDate: formatDateToLocalYYYYMMDD(selectedDate),
            deliveryTimeSlot: selectedTimeSlot,
          }),
        },
      );
      const { message } = await response.json();
      if (response.ok) alert(message);
    } catch (e) {
      console.error("Ошибка при обновлении времени доставки: ", e);
      alert("Ошибка при обновлении времени доставки");
    }
  };
  // -top-75 -right-110
  return (
    <div ref={calendarRef} className="absolute left-full bottom-full z-50 mt-14">
      <div className="px-5 py-5 w-92 bg-white rounded shadow-button-secondary">
        <div className="flex justify-between items-center pb-6">
          <h4 className="text-lg text-main-text">Изменить время</h4>
          <button onClick={onClose} className="cursor-pointer hover:opacity-70">
            <Image
              src="/icons-auth/icon-form-close.svg"
              alt="Закрыть"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>
        </div>
        <Calendar
          isOrderDateChange={true}
          customDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
        {order && (
          <div className="p-5 text-main-text text-lg text-center">
            {formatDeliveryDateTime(
              order.deliveryTime.date,
              order.deliveryTime.timeSlot,
            )}
          </div>
        )}
        {isLoading ? (
          <div className="py-4 text-center text-main-text">
            Загрузка слотов доставки...
          </div>
        ) : scheduleData?.schedule ? (
          <>
            {availableTimeSlots.length > 0 ? (
              <>
                <div className="mt-4 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimeSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      const isOriginalOrderSlot =
                        order?.deliveryTime.date &&
                        order?.deliveryTime.timeSlot === slot &&
                        formatDateToLocalYYYYMMDD(
                          new Date(order?.deliveryTime.date),
                        ) === formatDateToLocalYYYYMMDD(selectedDate);

                      const shouldHighlight =
                        isSelected ||
                        (isOriginalOrderSlot && !selectedTimeSlot);
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 px-3 rounded text-sm duration-300 cursor-pointer ${
                            shouldHighlight
                              ? "bg-primary text-white"
                              : "bg-gray-100 hover:bg-primary hover:text-white"
                          }`}
                        >
                          <span>{slot.replace(".", ":").split("-")[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4">
                  <button
                    onClick={updateOrderDeliveryTime}
                    className={`flex-1 h-10 rounded cursor-pointer ${
                      selectedTimeSlot
                        ? `${buttonStyles.active}`
                        : `${buttonStyles.inactive}`
                    }`}
                  >
                    Подтвердить
                  </button>
                </div>
              </>
            ) : (
              <div className="py-4 text-center text-gray-500">
                На выбранную дату нет доступных временных слотов
              </div>
            )}
          </>
        ) : (
          <div className="py-4 text-center text-gray-500">
            Нет данных о графике доставки
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarOrderModal;
