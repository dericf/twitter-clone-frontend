import { APIResponse } from "./API";
import { EmptyResponse } from "./General";

export interface Follows {
  userId: number;
  username: string;
  email: string;
  bio: string;
  birthdate: string;
}

export interface FollowsRequestBody {
  userId: number;
}

export type FollowsResponse = APIResponse<Array<Follows>>;

export interface FollowsCreateRequestBody {
  followUserId: number;
}

export type FollowsCreateResponse = APIResponse<EmptyResponse>;

export interface FollowsDeleteRequestBody {
  followUserId: number;
}

export type FollowsDeleteResponse = APIResponse<EmptyResponse>;
