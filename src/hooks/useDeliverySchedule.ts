import { useCallback, useState } from "react";

import { getDates } from "@/app/(admin)/admin/delivery-schedule/_utils/getDates";
import { convertTimeToMinutes } from "@/app/(admin)/admin/delivery-schedule/_utils/convertTimeToMinutes";

import { Schedule } from "@/types/deliverySchedule";

export const useDeliverySchedule = () => {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("14:00");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const dates = getDates();

  const showMessage = (text: string): void => setMessage(text);

  const initilizeEmptySchedule = useCallback((): void => {
    const emptySchedule: Schedule = {};
    for (const date of dates) {
      emptySchedule[date] = {};
    }
    setSchedule(emptySchedule);
  }, [dates]);

  const fetchDeliverySchedule = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/delivery-schedule");
      if (!response.ok) throw new Error("Не удалось получить данные о графике доставок");
      const data = await response.json();

      if (data.schedule && Object.keys(data.schedule).length > 0) {
        const loadedSchedule = data.schedule;
        const updatedSchedule = dates.reduce<Schedule>((acc, curr) => {
          acc[curr] = loadedSchedule[curr] ? { ...loadedSchedule[curr] } : {};
          return acc;
        }, {});

        setSchedule(updatedSchedule);

        const slots = new Set(dates.flatMap((date) => Object.keys(updatedSchedule[date]) || {}));
        setTimeSlots(Array.from(slots));
      } else {
        initilizeEmptySchedule();
      }
    } catch {
      setError("Ошибка загрузки графика доставок");
      initilizeEmptySchedule();
    } finally {
      setIsLoading(false);
    }
  }, [initilizeEmptySchedule, dates]);

  const addTimeSlot = useCallback((): void => {
    setError("");

    if (!startTime.trim() || !endTime.trim()) {
      setError("Необходимо заполнить оба поля");
      return;
    }

    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = convertTimeToMinutes(endTime);

    if (startMinutes >= endMinutes) {
      setError("Время начала не может быть раньше время окончания");
      return;
    }

    const newTimeSlot = `${startTime}-${endTime}`;

    const hasOverlap = timeSlots.some((slot) => {
      const [start, end] = slot.split("-");
      const existingStartMinutes = convertTimeToMinutes(start);
      const existingEndMinutes = convertTimeToMinutes(end);

      return (
        (startMinutes >= existingStartMinutes &&
          startMinutes < existingEndMinutes) ||
        (endMinutes > existingStartMinutes &&
          endMinutes <= existingEndMinutes) ||
        (startMinutes <= existingStartMinutes &&
          endMinutes >= existingEndMinutes)
      );
    });

    if (hasOverlap) {
      setError("Временной слот пересекается с уже существующими");
      return;
    }

    setTimeSlots((prev) => [...prev, newTimeSlot]);

    const updatedSchedule = { ...schedule };

    for (const date of dates) {
      if (!updatedSchedule[date]) updatedSchedule[date] = {};
      updatedSchedule[date][newTimeSlot] = true;
    }

    setSchedule(updatedSchedule);
    showMessage("Временной слот добавлен для всех дней");
  }, [startTime, endTime, schedule, dates, timeSlots]);

  const updateTimeSlotStatus = (date: string, timeSlot: string, isFree: boolean): void => {
    setError("");
    setSchedule((prev) => {
      return { ...prev, [date]: { ...prev[date], [timeSlot]: isFree } };
    });
  };

  const removeTimeSlot = useCallback((timeSlot: string): void => {
      setError("");
      setTimeSlots((prev) => prev.filter((slot) => slot !== timeSlot));
      const updatedSchedule = { ...schedule };

      for (const date of dates) {
        if (updatedSchedule[date]) delete updatedSchedule[date][timeSlot];
      }

      setSchedule(updatedSchedule);
      setMessage("Временной слот удален для всех дней");
    },
    [dates, schedule],
  );

  const saveDeliverySchedule = async (): Promise<void> => {
    try {
      setIsSaving(true);
      setError("");
      setMessage("");

      const scheduleToSave: Schedule = {};
      for (const date of dates) {
        scheduleToSave[date] = {};
        for (const slot of timeSlots) {
          scheduleToSave[date][slot] = schedule[date]?.[slot] !== false;
        }
      }

      const response = await fetch("/api/delivery-schedule", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ schedule: scheduleToSave }),
      });

      const saveResult = await response.json();
      if (saveResult.success) showMessage("График доставки успешно сохранен");
      else setError(saveResult.error || "Ошибка при сохранении");
    } catch (e) {
      console.log("Ошибка при сохранении графика: ", e);
      setError("шибка при сохранении графика доставки");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    schedule,
    isLoading,
    isSaving,
    message,
    error,
    startTime,
    endTime,
    timeSlots,
    setStartTime,
    setEndTime,
    fetchDeliverySchedule,
    addTimeSlot,
    updateTimeSlotStatus,
    removeTimeSlot,
    saveDeliverySchedule,
  };
};
