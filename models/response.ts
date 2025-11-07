export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponse {
  message: { message: "User not found"; success: false };
  status: 404;
}
