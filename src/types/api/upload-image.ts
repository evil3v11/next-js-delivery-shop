import { ApiResponse } from "./default-response";

export type ImageUploadResponse =
  | (Pick<ApiResponse, "success"> & {
      url: string;
      fileName: string;
    })
  | ApiResponse;
