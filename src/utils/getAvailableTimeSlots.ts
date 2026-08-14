import { isTimeSlotPassed } from "@/app/(cart)/cart/_utils/isTimeSlotPassed";
import { formatDateToLocalYYYYMMDD } from "./formatDateToLocalYYYYMMDD";

import type { Schedule } from "@/types/deliverySchedule";

export const getAvailableTimeSlots = (date: Date, schedule: Schedule): string[] => {
  const dateString = formatDateToLocalYYYYMMDD(date);
  const daySchedule = schedule[dateString];
  if (!daySchedule) return [];

  return Object.entries(daySchedule)
    .filter(([timeSlot, available]) => {
      if (!available) return;
      const isPassed = isTimeSlotPassed(timeSlot, dateString);
      return !isPassed;
    })
    .map(([timeslot]) => timeslot)
    .sort();
};
