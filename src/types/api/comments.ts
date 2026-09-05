import { UserData } from "../userData";
import { ApiResponse } from "./default-response";

type User = Pick<UserData, "gender" | "name" | "lastName">;

export type GetUserGenderResponse = ApiResponse & {
  data?: User;
};
