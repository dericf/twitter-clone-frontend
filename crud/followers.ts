import { FollowerRequestParams, FollowerResponse } from "../schema/Followers";
import { FollowsRequestBody } from "../schema/Follows";
import { TweetResponse } from "../schema/Tweet";

export const getAllFollowers = async (
  params: FollowerRequestParams,
): Promise<FollowerResponse> => {
  try {
    // Base URL
    let url = new URL(`http://localhost:8001/followers/${params.userId}`);

    // Include optional search params if present
    // if (params.userId) {
    //   url.searchParams.set("tweetId", params.userId.toString());
    // }
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    // console.log("res.json :>> ", res.status);
    if (res.status >= 200 && res.status < 300) {
      const json: FollowerResponse = await res.json();

      // console.log("json :>> ", json);
      return json;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Caught error: ", error);
    return null;
  }
};
