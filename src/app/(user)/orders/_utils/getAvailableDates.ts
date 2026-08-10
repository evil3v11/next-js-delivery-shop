import { getDates } from "@/app/(admin)/admin/delivery-schedule/_utils/getDates";

import { Schedule } from "@/types/deliverySchedule";
import { AvailableDate } from "@/types/order";

export const getAvailableDates = (schedule: Schedule): AvailableDate[] => {
  const dates = getDates();

  return dates
    .map((date) => {
      const daySchedule = schedule[date];
      if (!daySchedule) return null;

      const totalSlots = Object.values(daySchedule).filter((available) => available).length;

      return {
        date: new Date(date),
        dateString: date,
        availableSlots: totalSlots,
      };
    })
    .filter((date) => date !== null);
};
