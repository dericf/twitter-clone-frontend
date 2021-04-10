import { errorTextFromStatusCode, responseDidSucceed } from "../schema/API";
import {
  Follower,
  FollowerRequestParams,
  FollowerResponse,
} from "../schema/Followers";
import { FollowsRequestBody } from "../schema/Follows";
import { TweetResponse } from "../schema/Tweet";

export const getAllFollowers = async (
  params: FollowerRequestParams,
): Promise<FollowerResponse> => {
  let url = new URL(`http://localhost:8001/followers/${params.userId}`);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (responseDidSucceed(res.status)) {
    const json: Array<Follower> = await res.json();
    return {
      value: json,
    };
  } else {
    return {
      error: errorTextFromStatusCode(res.status),
    };
  }
};
