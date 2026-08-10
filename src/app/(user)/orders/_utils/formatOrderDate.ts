export const formatOrderDate = (orderDate: string): string => {
  return new Date(orderDate)
    .toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//, ".");
};
