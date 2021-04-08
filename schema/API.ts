// Each API return type should extend this
export interface APIResponse<T> {
  value?: T;
  error?: ApiResponseErrorCode;
}

type ApiResponseErrorCode =
  | "not-authenticated"
  | "not-authorized"
  | "validation-failed"
  | "not-acceptable"
  | "server-error";

export const errorTextFromStatusCode = (
  statusCode: number,
): ApiResponseErrorCode => {
  // TODO: Might want to reconsider this pattern - but ok for now
  if (statusCode === 401) {
    return "not-authenticated";
  } else if (statusCode === 406) {
    return "not-acceptable";
  } else if (statusCode === 422) {
    return "validation-failed";
  } else {
    return "server-error";
  }
};

export const responseDidSucceed = (statusCode: number): boolean => {
  return statusCode >= 200 && statusCode < 300;
};
