import { CartItem } from "@/types/cart";
import { ObjectId } from "mongodb";

export type UserRole = "user" | "manager" | "admin";

export type UserDataOrNull = UserData | null;

export type UserData = {
  _id: ObjectId | string
  id: string;
  name: string;
  lastName: string;
  age: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  gender: string;
  birthdayDate: string;
  location?: string;
  region: string;
  card?: string;
  hasNoCard?: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  favorites?: string[];
  cart: CartItem[];
  bonusesAmount?: number;
};
