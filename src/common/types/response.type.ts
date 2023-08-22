import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
export type APIresponseType = {
  ok: boolean;
  message: string;
  data?: any;
};

export type PaginationResponse = {
  limit: number; // records per page
  count: number; // number of records in current response
  total_count?: number; // total number of records present
  current_offset: number;
  next_offset: number | null;
};

export type CloudinaryResponse = UploadApiErrorResponse | UploadApiResponse;
