import { useGetAdminOrdersQuery } from "@/store/redux/api/ordersApi";

import TimeSlotGroup from "./TimeSlotGroup";

const TimeSlotSection = ({ orderIds }: { orderIds: string[] }) => {
  const { data } = useGetAdminOrdersQuery();

  const orders = data?.orders.filter((o) => orderIds.includes(String(o._id))) || [];

  const timeSlots = [...new Set(orders.map((o) => o.deliveryTime.timeSlot))].sort();

  const timeSlotGroups = timeSlots.map((timeSlot) => ({
    timeSlot,
    orderIds: orders.filter((o) => o.deliveryTime.timeSlot === timeSlot).map(o => String(o._id)),
  }));

  return (
    <div className="flex flex-col gap-y-30">
      {timeSlotGroups.map(({ timeSlot, orderIds }) => {
        return (
          <TimeSlotGroup
            key={timeSlot}
            timeSlot={timeSlot}
            orderIds={orderIds}
          />
        );
      })}
    </div>
  );
};

export default TimeSlotSection;
