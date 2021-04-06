// Each API return type should extend this
export interface APIResponse<T> {
  value?: T;
  error?: ApiResponseErrorCode;
}

type ApiResponseErrorCode =
  | "not-authenticated"
  | "not-authorized"
  | "validation-failed"
  | "server-error";

export const errorTextFromStatusCode = (
  statusCode: number,
): ApiResponseErrorCode => {
  if (statusCode === 401) {
    return "not-authenticated";
  } else if (statusCode === 422) {
    return "validation-failed";
  } else {
    return "server-error";
  }
};
