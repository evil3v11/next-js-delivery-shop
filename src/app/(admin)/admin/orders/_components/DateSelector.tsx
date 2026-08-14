"use client";

import { Activity, useEffect, useState } from "react";

import { Order } from "@/types/order";

import Image from "next/image";
import DateFilterButtons from "./DateFilterButtons";
import Calendar from "./Calendar";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";

interface DateSelectorProps {
  orders: Order[];
  dates: string[];
  selectedDate: string;
  customDate: Date | undefined;
  onDateSelect: (date: string) => void;
  isCalendarOpen: boolean;
  toggleCalendar: () => void;
  onCalendarDateSelect: (date: Date | undefined) => void;
}

const DateSelector = ({
  orders,
  dates,
  selectedDate,
  customDate,
  onDateSelect,
  isCalendarOpen,
  toggleCalendar,
  onCalendarDateSelect,
}: DateSelectorProps) => {
  const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(customDate || new Date());

  const calendarRef = useClickOutsideModal<HTMLButtonElement>(isCalendarOpen ? toggleCalendar : () => {});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (customDate) setCalendarMonth(customDate);
  }, [customDate]);

  const handleDateSelect = (date: Date | undefined): void => {
    if (date) setCalendarMonth(date);
    onCalendarDateSelect(date);
  };

  return (
    <div className="flex justify-start items-center gap-3 relative mb-15">
      <button
        type="button"
        onClick={toggleCalendar}
        ref={calendarRef}
        className="relative hover:opacity-70 transition-opacity rounded w-15 h-15 bg-[#f3f2f1] flex justify-center items-center cursor-pointer"
      >
        <Image
          src="/icons-auth/icon-date.svg"
          alt="Календарь"
          width={24}
          height={24}
        />
      </button>
      {customDate && (
        <span className="absolute -top-5 text-xs text-main-text">
          {customDate.toLocaleDateString("ru-RU")}
        </span>
      )}
      <Activity mode={isCalendarOpen ? "visible" : "hidden"}>
        <Calendar
          customDate={customDate}
          onDateSelect={handleDateSelect}
          month={calendarMonth}
        />
      </Activity>
      <DateFilterButtons
        dates={dates}
        orders={orders}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />
    </div>
  );
};

export default DateSelector;
