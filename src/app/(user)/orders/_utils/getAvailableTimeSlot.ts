import { formatDateToString } from "@/utils/formatDateToString";
import { isTimeSlotPassed } from "@/app/(cart)/cart/_utils/isTimeSlotPassed";

import { Schedule } from "@/types/deliverySchedule";

export const getAvailableTimeSlot = (date: Date, schedule: Schedule): string[] => {
  const dateString = formatDateToString(date);
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
