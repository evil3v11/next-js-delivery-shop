import { formatDateToString } from "@/utils/formatDateToString";

export const isTimeSlotPassed = (timeSlot: string, date: string): boolean => {
  const today = new Date();
  
  // Проверяем, что выбран сегодняшний день
  const todayString = formatDateToString(today);
  if (date !== todayString) return false; // Для всех дат кроме сегодняшней слоты всегда доступны

  // Дальше проверяем только для сегодняшнего дня
  const [, endTime] = timeSlot.split("-");
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const slotEnd = new Date();
  slotEnd.setHours(endHours, endMinutes, 0, 0);
  const cutoff = new Date(slotEnd.getTime() - 30 * 60 * 1000);

  return today >= cutoff;
};