"use client";

import { useEffect } from "react";
import { useDeliverySchedule } from "@/hooks/useDeliverySchedule";

import { getDates } from "./_utils/getDates";
import { sortTimeSlots } from "./_utils/sortTimeSlots";

import Loader from "@/components/Loader";
import AddTimeSlotForm from "./_components/AddTimeSlotForm";
import AlertMessage from "./_components/AlertMessage";
import SaveButton from "./_components/SaveButton";
import ScheduleTable from "./_components/ScheduleTable";

const DeliverySchedulePage = () => {
  const {
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
  } = useDeliverySchedule();

  useEffect(() => {
    fetchDeliverySchedule()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedTimeSlots = sortTimeSlots(timeSlots) 

  const dates = getDates()

  if (isLoading) return <Loader />;

  return (
    <div className="p-3 md:p-4 xl:p-6 w-full mx-auto md:w-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
        Управление графиком доставки на 3 дня
      </h1>
      <AddTimeSlotForm
        startTime={startTime}
        endTime={endTime}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onAddTimeSlot={addTimeSlot}
      />
      <div className="bg-white rounded border border-gray-200 mb-4 md:mb-6 overflow-x-auto">
        <ScheduleTable
          sortedTimeSlots={sortedTimeSlots}
          dates={dates}
          schedule={schedule}
          onRemoveTimeSlot={removeTimeSlot}
          onUpdateTimeSlotStatus={updateTimeSlotStatus}
        />
      </div>
      <SaveButton isSaving={isSaving} onSaveSchedule={saveDeliverySchedule} />
      {message && <AlertMessage message={message} />}
      {error && (
        <div className="p-3 md:p-4 mb-4 rounded border bg-[#ffc7c7] text-[#d80000]">
          {error}
        </div>
      )}
    </div>
  );
};

export default DeliverySchedulePage;
