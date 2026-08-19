import { CategoryFormData } from "../categories/_types";

export type CharCount = Record<keyof Omit<CategoryFormData, "image">, number>;
