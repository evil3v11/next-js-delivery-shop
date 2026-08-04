export const formatDateFull = (date: string): string => {
  const [year, month, day] = date.split("-").map(Number);
  const newDate = new Date(year, month - 1, day);

  return newDate.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
};

export const formatDateNumeric = (date: string): string => {
  const [year, month, day] = date.split("-").map(Number);
  const newDate = new Date(year, month - 1, day);

  return newDate.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};
