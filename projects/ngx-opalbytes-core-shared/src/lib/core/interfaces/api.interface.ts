export interface IApiResponse<T = unknown> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  success: boolean;
  messages: string[];
}
