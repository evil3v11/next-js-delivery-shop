"use client";

import { useEffect, useState } from "react";

import { formatDateToString } from "@/utils/formatDateToString";
import { formatTimeSlot } from "@/app/(cart)/cart/_utils/formatTimeSlot";
import { getAvailableDates } from "../_utils/getAvailableDates";
import { getAvailableTimeSlots } from "@/utils/getAvailableTimeSlots";
import { formatDisplayDate } from "../_utils/formatDisplayDate";
import {
  formatDateFull,
  formatDateNumeric,
} from "@/app/(admin)/admin/delivery-schedule/_utils/formatDate";

import { Schedule } from "@/types/deliverySchedule";
import { AvailableDate } from "@/types/order";

import MiniLoader from "@/components/MiniLoader";

interface DeliveryDatePickerProps {
  schedule: Schedule;
  isCreatingOrder: boolean;
  onDateSelect: (date: Date, timeSlot: string) => void;
  onCancel: () => void;
}

const DeliveryDatePicker = ({
  schedule,
  isCreatingOrder,
  onDateSelect,
  onCancel,
}: DeliveryDatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);

  useEffect(() => {
    const dates = getAvailableDates(schedule);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAvailableDates(dates);

    if (dates.length > 0 && !selectedDate) setSelectedDate(dates[0].date);
  }, [schedule, selectedDate]);

  const handleDateSelect = (date: Date): void => setSelectedDate(date);
  const handleTimeSlotSelect = (timeslot: string): void => {
    if (selectedDate) onDateSelect(selectedDate, timeslot);
  };

  const availableTimeSlots = selectedDate
    ? getAvailableTimeSlots(selectedDate, schedule)
    : [];

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">
          Выберите дату и время доставки
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Дата доставки:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availableDates.map((item) => {
              const isSelected =
                selectedDate?.toDateString() === item.date.toDateString();
              return (
                <button
                  key={item.dateString}
                  onClick={() => handleDateSelect(item.date)}
                  className={`py-2 px-3 rounded text-sm duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div
                    className={`text-xs mt-1 ${
                      isSelected ? "text-white" : "text-main-text"
                    }`}
                  >
                    {formatDateNumeric(formatDateToString(item.date))}
                  </div>
                  <div
                    className={`text-xs hidden xs:block ${
                      isSelected ? "text-white" : "text-main-text"
                    }`}
                  >
                    {formatDateFull(formatDateToString(item.date))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {selectedDate && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Доступное время доставки на {formatDisplayDate(selectedDate)}:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableTimeSlots.map((slot) => {
                const formatted = formatTimeSlot(slot);
                return (
                  <button
                    key={slot}
                    onClick={() => handleTimeSlotSelect(slot)}
                    disabled={isCreatingOrder}
                    className="bg-gray-100 hover:bg-primary hover:text-white py-2 px-3 rounded text-sm duration-300 cursor-pointer disabled:opacity-50"
                  >
                    <span className="xl:hidden">{formatted.mobileLabel}</span>
                    <span className="hidden xl:block">
                      {formatted.desktopLabel}
                    </span>
                  </button>
                );
              })}
              {availableTimeSlots.length === 0 && (
                <p className="col-span-2 text-center text-gray-500 py-2">
                  Нет доступных временных интервалов
                </p>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 hover:text-white duration-300 cursor-pointer"
            disabled={isCreatingOrder}
          >
            Отмена
          </button>
        </div>
        {isCreatingOrder && (
          <div className="mt-4 text-center">
            <MiniLoader />
            <p className="text-sm text-gray-600">Создаем заказ...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDatePicker;
