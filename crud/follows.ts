import { FollowsCreateRequestBody, FollowsDeleteRequestBody, FollowsResponse } from "../schema/Follows";

export const getAllFollows = async (
  userId: number,
): Promise<FollowsResponse> => {
  try {
    // Base URL
    let url = new URL(`http://localhost:8001/follows/${userId}`);

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
      const json: FollowsResponse = await res.json();

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


export const createNewFollow = async (
  requestBody: FollowsCreateRequestBody,
): Promise<EmptyResponse> => {
  try {
    const res = await fetch(`http://localhost:8001/follows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(requestBody),
      credentials: "include",
    });
    if (res.status >= 200 && res.status < 300) {
      const json: EmptyResponse = await res.json();
      return json;
    } else {
      // Non-200 response TODO: Throw custom error and make caller handle
      return null;
    }
  } catch (error) {
    // Actual Error
    console.log("Caught error :>> ", error);
    return null;
  }
};


export const deleteFollow = async (
  requestBody: FollowsDeleteRequestBody,
): Promise<EmptyResponse> => {
  try {
    const res = await fetch(`http://localhost:8001/follows`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(requestBody),
      credentials: "include",
    });
    if (res.status >= 200 && res.status < 300) {
      const json: EmptyResponse = await res.json();
      return json;
    } else {
      // Non-200 response TODO: Throw custom error and make caller handle
      return null;
    }
  } catch (error) {
    // Actual Error
    console.log("Caught error :>> ", error);
    return null;
  }
};
