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

export type FollowerResponse = Array<Follower>;


