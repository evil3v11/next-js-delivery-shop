import { DeliveryAddress, DeliveryData } from "../order";

export type UseRepeatOrderResult = {
  selectedDelivery: DeliveryData | null;
  showDatePicker: boolean;
  showDeliveryButton: boolean;
  isRepeatOrderCreated: boolean;
  handleDeliveryClick: () => void;
  handleOrderClick: () => void;
  handleDateSelect: (
    date: Date,
    timeSlot: string,
    address: DeliveryAddress,
  ) => void;
  handleCancelDelivery: () => void;
  setIsRepeatOrderCreated: (isRepeatOrderCreated: boolean) => void;
  setSelectedDelivery: (selectedDelivery: DeliveryData | null) => void;
  handleEditDelivery: () => void;
  handleReorderSuccess: () => void;
};
