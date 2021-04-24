import { APIResponse } from "./API";

export interface Count {
  count: number;
}

export type CountResponse = APIResponse<Count>;
