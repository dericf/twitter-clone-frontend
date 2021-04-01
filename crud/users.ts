
import { User, UserResponse } from "../schema/User";

export const getUserById = async (userId: number): Promise<User> => {
  try {
    const res = await fetch(
      `http://localhost:8001/tweets/${
        userId ? "?userId=" + String(userId) : ""
      }`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    // console.log("res.json :>> ", res.status);
    if (res.status >= 200 && res.status < 300) {
      const userResponse: UserResponse = await res.json();

      // console.log("json :>> ", json);
      return userResponse[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log("Caught error: ", error);
    return null;
  }
};