import React, {
  useState,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import { useAlert } from "./useAlert";
import { useRouter } from "next/router";
import {
  User,
  UserCreateResponse,
  UserCreateRequestBody,
  UserRegisterForm,
} from "../schema/User";
import { LoginResponseBody } from "../schema/Auth";

import { APIResponse, APIResponseError } from "../schema/API";
export interface Auth {
  isAuthenticated: boolean;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  tryAuthenticateWithUsernamePassword: (
    username: string,
    password: string,
    loginRedirect?: string,
  ) => Promise<boolean>;
  loadAuthState: () => Promise<APIResponse<boolean>>;
  logout: () => void;
  tryRegister: (_: UserCreateRequestBody) => Promise<UserCreateResponse>;
}

// export const initialAuthValue = {
//   isAuthenticated: false,
//   user: null,
//   tryAuthenticateWithUsernamePassword: (
//     username: string,
//     password: string,
//     loginRedirect: string = "/",
//   ) => {},
//   loadAuthState: () => {},
//   logout: () => {},
// };

export const AuthContext = createContext({} as Auth);

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Toast notifications
  const { sendAlert, sendError } = useAlert();

  // Next router
  const router = useRouter();

  const tryAuthenticateWithUsernamePassword = async (
    username: string,
    password: string,
    loginRedirect: string = "/",
  ): Promise<boolean> => {
    // Server Auth Scheme requires form data - not regular json body
    let formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: "include",
      body: formData,
    });

    if (res.status >= 200 && res.status < 300) {
      const json: LoginResponseBody = await res.json();

      // Get the user data from server
      const { value: user, error } = await getAuthUserData();
      if (error) throw new Error(error.errorMessageUI);
      setIsAuthenticated(true);
      setUser(user);

      // Check if user was redirect to log in from another page
      // If so -> navigate back to it
      if (loginRedirect) {
        router.push(loginRedirect);
      } else {
        router.push("/");
      }
      return true;
    } else {
      const json = await res.json();
      throw new Error(json.detail);
    }
  };

  const tryRegister = async (
    args: UserRegisterForm,
  ): Promise<UserCreateResponse> => {
    const { username, email, bio, birthdate, password, confirmPassword } = args;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: JSON.stringify(args),
      });

      if (res.status >= 200 && res.status < 300) {
        const json = await res.json();
        // console.log("json :>> ", json);
        // await tryAuthenticateWithUsernamePassword(username, password);
        // setIsAuthenticated(true);
        // const user: User = await getAuthUserData();
        // setUser(user);
        // setTimeout(() => {
        //   router.push("/ ");
        // }, 1000);
        router.push("/confirm-email");
      } else {
        sendError("Error registering user. Please try again.");
        return null;
      }
    } catch (error) {
      console.log("Caught error :>> ", error);
      sendError("Error logging in. Please try again.");
      return null;
    }
  };

  const getAuthUserData = async (): Promise<APIResponse<User>> => {
    /**
     * This function will succeed if the client's auth cookie is still valid.
     */
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (res.status >= 200 && res.status < 300) {
        const user: User = await res.json();
        // console.log("user :>> ", user);
        // sendAlert("Successfully loaded user session");
        return {
          value: user,
        };
      } else {
        return {
          error: new APIResponseError(res),
        };
      }
    } catch (error) {
      return {
        error: new APIResponseError(null, error),
      };
    }
  };

  const logout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({}),
    });
    setIsAuthenticated(false);
    setUser(null);
    setTimeout(() => {
      router.push("/").then(() => {});
    }, 200);
  };

  const loadAuthState = async (): Promise<APIResponse<boolean>> => {
    // Try and get the authenticated user data
    const { value: user, error } = await getAuthUserData();
    if (user) {
      setIsAuthenticated(true);
      setUser(user);
      return {
        value: true,
      };
    } else {
      setIsAuthenticated(false);
      setUser(null);
      return {
        error: error,
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        tryAuthenticateWithUsernamePassword,
        tryRegister,
        logout,
        loadAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext<Auth>(AuthContext);
  return ctx;
};
