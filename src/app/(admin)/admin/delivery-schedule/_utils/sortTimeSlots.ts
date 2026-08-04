import { convertTimeToMinutes } from "./convertTimeToMinutes";

export const sortTimeSlots = (slots: string[]): string[] => {
  return [...slots].sort((a, b) => {
    const [startA] = a.split("-");
    const [startB] = b.split("-");
    return convertTimeToMinutes(startA) - convertTimeToMinutes(startB);
  });
};
