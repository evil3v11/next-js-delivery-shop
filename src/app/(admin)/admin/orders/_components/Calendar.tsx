"use client";

import { useEffect, useState } from "react";

import "react-day-picker/style.css";
import "../daypicker.css";

import Image from "next/image";
import { DayPicker } from "react-day-picker";
import { ru } from "react-day-picker/locale";

interface CalendarProps {
  customDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  month?: Date;
  isOrderDateChange?: boolean;
}

const Calendar = ({
  customDate,
  onDateSelect,
  month,
  isOrderDateChange = false,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(month || customDate || new Date());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (month) setCurrentMonth(month);
  }, [month]);

  const getMonthName = (date: Date): string => {
    const monthName = date.toLocaleDateString("ru-RU", { month: "long" });
    const capitalizedMonth =
      monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const year = date.getFullYear();

    return `${capitalizedMonth} ${year}`;
  };

  const handlePreviousMonth = (): void => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = (): void => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  return (
    <div
      className={
        isOrderDateChange
          ? ""
          : "absolute top-17 left-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80"
      }
    >
      <div className="flex justify-between items-center mb-4 w-full">
        <span className="text-lg font-bold text-main-text">
          {getMonthName(currentMonth)}
        </span>
        <div className="flex gap-x-4 justify-center">
          <button
            onClick={handlePreviousMonth}
            className="p-2 bg-[#f3f2f1] rounded duration-300 cursor-pointer group"
          >
            <Image
              src="/icons-header/icon-arrow-right.svg"
              width={24}
              height={24}
              alt="Предыдущий месяц"
              className="rotate-180 group-hover:sepia group-hover:brightness-0 transition duration-300"
            />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 bg-[#f3f2f1] rounded duration-300 cursor-pointer group"
          >
            <Image
              src="/icons-header/icon-arrow-right.svg"
              width={24}
              height={24}
              alt="Следующий месяц"
              className="group-hover:sepia group-hover:brightness-0 transition duration-300"
            />
          </button>
        </div>
      </div>
      <DayPicker
        mode="single"
        selected={customDate}
        onSelect={onDateSelect}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        locale={ru}
        showOutsideDays={true}
        className="p-0 flex items-center justify-center"
        classNames={{
          root: "w-full",
          month: "w-full",
          nav: "hidden",
          day: "size-10 rounded-full text-[#606060] hover:text-white hover:bg-[#ff6633] duration-300 cursor-pointer mx-auto",
        }}
        modifiersStyles={{
          selected: {
            color: "white",
            backgroundColor: "var(--color-primary)",
            border: "none",
          },
          today: {
            color: "white",
            backgroundColor: "var(--color-secondary)",
            border: "none",
          },
        }}
      />
    </div>
  );
};

export default Calendar;
