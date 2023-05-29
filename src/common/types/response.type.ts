import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
export type APIresponseType = {
  ok: boolean;
  message: string;
  data?: any;
};
export type CloudinaryResponse = UploadApiErrorResponse | UploadApiResponse;
