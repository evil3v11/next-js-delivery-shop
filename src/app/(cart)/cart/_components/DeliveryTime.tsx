"use client";

import { useEffect, useState } from "react";

import { getDates } from "@/app/(admin)/admin/delivery-schedule/_utils/getDates";
import { formatTimeSlot } from "../_utils/formatTimeSlot";
import { isTimeSlotPassed } from "../_utils/isTimeSlotPassed";

import { Schedule } from "@/types/deliverySchedule";

import { formStyles } from "@/app/styles";
import { additionalStyles, labelStyles, selectStyles } from "../styles";

import { Clock } from "lucide-react";
import DeliveryTimeSkeletons from "./DeliveryTimeSkeletons";

interface DeliveryTimeProps {
  selectedDate: string;
  selectedTimeSlot: string;
  onDateChange: (date: string) => void;
  onTimeSlotChange: (timeSlot: string) => void;
}

const DeliveryTime = ({
  selectedDate,
  selectedTimeSlot,
  onDateChange,
  onTimeSlotChange,
}: DeliveryTimeProps) => {
  const [availableDates, setAvailableDates] = useState<{ value: string; label: string }[]>([]);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [tooltipSlot, setTooltipSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDelivetySchedule = async (): Promise<void> => {
      try {
        const response = await fetch("/api/delivery-schedule");
        const data = await response.json();
        if (data.schedule) setSchedule(data.schedule);
      } catch (e) {
        console.error("Ошибка загрузки графика доставки: ", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDelivetySchedule();
  }, []);

  useEffect(() => {
    const dates = getDates().map((date) => {
      const [year, month, day] = date.split("-");
      const formattedDate = `${day}.${month}.${year}`;

      return { value: date, label: formattedDate };
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAvailableDates(dates);
    if (!selectedDate && dates.length > 0) onDateChange(dates[0].value);
  }, [onDateChange, selectedDate]);

  const getAllTimeSlots = () => {
    if (!schedule[selectedDate]) return [];

    const daySchedule = schedule[selectedDate];
    const slots = Object.keys(daySchedule)
      .sort((a, b) => {
        const [startA] = a.split("-");
        const [startB] = b.split("-");
        return startA.localeCompare(startB);
      })
      .map((slot) => {
        const formattedSlot = formatTimeSlot(slot);
        const isFree = daySchedule[slot] !== false;
        const isPassed = isTimeSlotPassed(slot, selectedDate);
        const isAvailable = isFree && !isPassed;
        return {
          value: slot,
          mobileLabel: formattedSlot.mobileLabel,
          desktopLabel: formattedSlot.desktopLabel,
          isAvailable,
          isPassed,
        };
      });

    return slots;
  };

  const handleTimeSlotClick = (slot: { value: string; isAvailable: boolean; isPassed?: boolean; }): void => {
    if (slot.isAvailable && !slot.isPassed) onTimeSlotChange(slot.value);
  };

  const timeSlots = getAllTimeSlots();

  if (isLoading) return <DeliveryTimeSkeletons />;

  return (
    <div>
      <h2 className="text-2xl xl:text-4xl font-bold mb-6">Когда</h2>
      <div className="relative flex flex-col gap-y-4 md:flex-row md:flex-nowrap md:gap-x-8 xl:gap-x-10">
        <div>
          <label className={`${labelStyles} text-sm xl:text-base`}>Дата</label>
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className={`${formStyles.input} ${additionalStyles} ${selectStyles} [&&]:md:w-38.75 [&&]:text-base`}
          >
            {availableDates.map((date) => (
              <option key={date.value} value={date.value}>
                {date.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-full">
          <label className={`${labelStyles} text-sm xl:text-base`}>Время</label>
          {timeSlots.length === 0 ? (
            <div className="text-center bg-[#ffc7c7] py-2 text-[#d80000] rounded">
              На выбранную дату нет доставки
            </div>
          ) : (
            <div className="text-base grid grid-cols-3 xl:grid-cols-4 gap-2 w-full">
              {timeSlots.map((slot) => (
                <div
                  key={slot.value}
                  className="relative"
                  onMouseEnter={() => (!slot.isAvailable || slot.isPassed) && setTooltipSlot(slot.value)}
                  onMouseLeave={() => setTooltipSlot(null)}
                  onTouchStart={() => (!slot.isAvailable || slot.isPassed) && setTooltipSlot(slot.value)}
                  onTouchEnd={() => setTooltipSlot(null)}
                >
                  <button
                    type="button"
                    onClick={() => handleTimeSlotClick(slot)}
                    className={`p-2 rounded justify-center items-center w-full h-10 duration-300 ${
                      selectedTimeSlot === slot.value &&
                      slot.isAvailable &&
                      !slot.isPassed
                        ? "bg-primary text-white hover:shadow-button-default active:shadow-button-active"
                        : slot.isAvailable && !slot.isPassed
                          ? "bg-[#f3f2f1] hover:shadow-button-secondary cursor-pointer"
                          : "bg-white opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!slot.isAvailable || slot.isPassed}
                  >
                    <span className="xl:hidden text-sm">
                      {slot.mobileLabel}
                    </span>
                    <span className="hidden xl:block text-base">
                      {slot.desktopLabel}
                    </span>
                  </button>
                  {(!slot.isAvailable || slot.isPassed) &&
                    tooltipSlot === slot.value && (
                      <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                        <div className="bg-[#f4f6fb] text-[#151515] text-sm rounded-[5px] p-2 flex items-center gap-2 whitespace-nowrap shadow-lg">
                          <Clock size={16} />
                          {slot.isPassed
                            ? "Это время уже прошло"
                            : "На это время доставить не можем"}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#f4f6fb]" />
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTime;
