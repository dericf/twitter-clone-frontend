import { APIResponse } from "./API";

export interface Follower {
  userId: number;
  username: string;
  email: string;
  bio: string;
  birthdate: string;
}

export interface FollowerRequestParams {
  userId: number;
}

export type FollowerResponse = APIResponse<Array<Follower>>;

export interface WSFollowerUpdateBody {
  userId?: number;
  followUserId: number;
}
