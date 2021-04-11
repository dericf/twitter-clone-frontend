// Each API return type should extend this
export interface APIResponse<T> {
  value?: T;
  error?: APIResponseError;
}

type ApiResponseErrorCode =
  | "not-authenticated"
  | "not-authorized"
  | "validation-failed"
  | "not-acceptable"
  | "server-error";

export class APIResponseError {
  /**
   * Takes in a response from server and provides a property to access UI
   * facing message (i.e. for use in toast-notifications).
   * TODO: Still needs a lot of design and implementation
   */
  public errorMessageUI: string;
  constructor(private response: Response | null, private error = null) {
    console.log("Creating new API response Object");
    if (!response) {
      this.errorMessageUI = "An Unknown Error Ocurred. We Apologize.";
    }
    (async () => {
      const json = await response.json();
      this.errorMessageUI = json.detail || "Unknown Error.";
    })().catch((error) => {
      this.errorMessageUI = "An Unknown Error Ocurred. We Apologize.";
    });
  }

  format() {
    return this.errorMessageUI;
  }
}

export const errorTextFromStatusCode = (
  statusCode: number,
): ApiResponseErrorCode => {
  // TODO: Might want to reconsider this pattern - but ok for now
  // ? Thought: could be a map/object. I need to figure out how to best
  // ? convert/interpret a response status
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
