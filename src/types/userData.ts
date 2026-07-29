export type UserRole = "user" | "manager" | "admin";

export type UserDataOrNull = UserData | null;

export type UserData = {
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
  hasCard?: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  favorites?: string[]
};
