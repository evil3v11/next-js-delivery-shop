export const getImagePath = (image: string): string => {
  if (!image || !image.trim()) return "";
  return image.split("/").pop() || "";
};
