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

export type FollowsResponse = Array<Follows>;

export interface FollowsCreateRequestBody {
  followUserId: number;
}

export interface FollowsDeleteRequestBody {
  followUserId: number;
}
