export const formatDeliveryDateTime = (
  dateStr: string,
  timeSlot: string,
): string => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleDateString("ru-RU", { month: "long" });
  const year = date.getFullYear();
  const time = timeSlot.split("-")[0];
  return `${day} ${month} ${year} ${time}`;
};
