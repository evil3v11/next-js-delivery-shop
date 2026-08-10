import { useEffect, useState } from "react";

import { Schedule } from "@/types/deliverySchedule";
import { UseDeliveryDataResult } from "@/types/hooks/useDeliveryData";

export const useDeliveryData = (): UseDeliveryDataResult => {
  const [deliverySchedule, setDeliverySchedule] = useState<Schedule>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDeliverySchedule = async (): Promise<void> => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/delivery-schedule");
        if (!response.ok)
          throw new Error("Ошибка при получении графика доставки");
        const { schedule } = await response.json();
        setDeliverySchedule(schedule || {});
      } catch (e) {
        console.error("Ошибка загрузки расписания доставки: ", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliverySchedule();
  }, []);

  return { deliverySchedule, isLoading };
};
