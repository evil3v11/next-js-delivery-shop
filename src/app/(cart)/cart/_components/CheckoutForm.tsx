"use client";

import { useEffect, useState } from "react";

import { DeliveryAddress as DAddress, DeliveryTime as DTime } from "@/types/order";

import DeliveryAddress from "./DeliveryAddress";
import DeliveryTime from "./DeliveryTime";

interface CheckoutFormProps {
  onFormDataChange: (deliveryData: {
    address: DAddress;
    time: DTime;
    isValid: boolean;
  }) => void;
}

const CheckoutForm = ({ onFormDataChange }: CheckoutFormProps) => {
  const [deliveryAddress, setDeliveryAddress] = useState<DAddress>({
    city: "",
    street: "",
    house: "",
    apartment: "",
    additional: "",
  });
  const [deliveryTime, setDeliveryTime] = useState<DTime>({
    date: "",
    timeSlot: "",
  });

  useEffect(() => {
    const isAddressValid = Boolean(deliveryAddress.city && deliveryAddress.street && deliveryAddress.house)
    const isTimeValid = Boolean(deliveryTime.date && deliveryTime.timeSlot)
    const isValid = isAddressValid && isTimeValid

    onFormDataChange({ address: deliveryAddress, time: deliveryTime, isValid })
  }, [deliveryAddress, deliveryTime, onFormDataChange])

  const handleFormDataChange = (field: keyof DAddress, value: string): void => setDeliveryAddress((prev) => ({ ...prev, [field]: value }));
  const handleDateChange = (date: string): void => setDeliveryTime(prev => ({...prev, date}))
  const handleTimeSlotChange = (timeSlot: string): void => setDeliveryTime(prev => ({...prev, timeSlot}))

  return (
    <div className="flex flex-col gap-y-10">
      <DeliveryAddress
        addressData={deliveryAddress}
        onFormDataChange={handleFormDataChange}
      />
      <DeliveryTime
        selectedDate={deliveryTime.date}
        selectedTimeSlot={deliveryTime.timeSlot}
        onDateChange={handleDateChange}
        onTimeSlotChange={handleTimeSlotChange}
      />
    </div>
  );
};

export default CheckoutForm;
