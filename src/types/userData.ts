export type UserData = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  gender: string;
  birthdayDate?: string;
  location?: string;
  region: string;
  card?: string;
  hasCard?: boolean;
  role: "user" | "manager" | "admin";
} | null;
