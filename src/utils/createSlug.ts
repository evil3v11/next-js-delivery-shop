import { transliterateText } from "./transliterateText";

export const createSlug = (text: string, id: number): string => {
  const transliterated = transliterateText(text, false);

  const slug = transliterated
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "-")
    .substring(0, 100);

  if (!slug) return `${id}`;
  return `${id}-${slug}`;
};
