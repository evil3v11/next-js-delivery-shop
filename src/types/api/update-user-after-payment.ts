import { ApiResponse } from "./default-response";

export type UpdateUserDataAfterPaymentResponse = ApiResponse & {
  availableBonuses?: number;
  requiredBonuses?: number;
}