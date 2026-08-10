export const formatDateToString = (date: Date): string =>
  date.toISOString().split("T")[0];
