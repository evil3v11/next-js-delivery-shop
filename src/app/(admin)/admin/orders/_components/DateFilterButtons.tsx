"use client";

import { formatDisplayDate } from "@/app/(user)/orders/_utils/formatDisplayDate";

import { Order } from "@/types/order";

interface DateFilterButtonsProps {
  orders: Order[];
  dates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const DateFilterButtons = ({
  dates,
  orders,
  selectedDate,
  onDateSelect,
}: DateFilterButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {dates.map((date) => {
        const ordersCount = orders.filter(
          (order) => order.deliveryTime.date === date,
        ).length;

        return (
          <button
            key={date}
            onClick={() => onDateSelect(date)}
            className={`p-4 w-46 h-15 rounded duration-300 cursor-pointer text-base md:text-lg xl:text-xl 
              flex justify-between items-center gap-2 
              ${
                selectedDate === date
                  ? "items-center bg-primary text-white relative gap-2 justify-between"
                  : "active:shadow-button-active bg-[#f3f2f1] hover:shadow-button-secondary text-main-text"
              }`}
          >
            {formatDisplayDate(new Date(date))}
            <div
              className="text-white w-8 h-8 text-xs md:text-sm xl:text-base bg-secondary rounded flex 
            justify-center items-center"
            >
              {ordersCount}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default DateFilterButtons;
