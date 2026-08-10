import { useState } from "react";

import { formatDateToString } from "@/utils/formatDateToString";

import { UseRepeatOrderResult } from "@/types/hooks/useRepeatOrder";
import { DeliveryAddress, DeliveryData } from "@/types/order";

export const useRepeatOrder = (): UseRepeatOrderResult => {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showDeliveryButton, setShowDeliveryButton] = useState<boolean>(false);
  const [isRepeatOrderCreated, setIsRepeatOrderCreated] = useState<boolean>(false)

  const handleDeliveryClick = (): void => setShowDatePicker(true);
  const handleOrderClick = (): void => setShowDeliveryButton(true);

  const handleDateSelect = (date: Date, timeSlot: string, address: DeliveryAddress): void => {
    const deliveryData: DeliveryData = {
      address,
      time: { date: formatDateToString(date), timeSlot },
    };

    setSelectedDelivery(deliveryData);
    setShowDatePicker(false);
  };

  const handleCancelDelivery = (): void => {
    setShowDeliveryButton(false);
    setSelectedDelivery(null);
    setShowDatePicker(false)
  };

  const handleEditDelivery = () => setShowDatePicker(true)

  const handleReorderSuccess = () => {
    setIsRepeatOrderCreated(true)
    setSelectedDelivery(null)
    setShowDeliveryButton(false)
  }

  return {
    selectedDelivery,
    showDatePicker,
    showDeliveryButton,
    isRepeatOrderCreated,
    handleDeliveryClick,
    handleOrderClick,
    handleDateSelect,
    handleCancelDelivery,
    setIsRepeatOrderCreated,
    setSelectedDelivery,
    handleEditDelivery,
    handleReorderSuccess,
  };
};
