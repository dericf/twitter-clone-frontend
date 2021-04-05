import React, { useState, useContext, createContext } from "react";
import { useAlert } from "./useAlert";
import { useRouter } from "next/router";
import {
  User,
  UserCreateResponse,
  UserCreateRequestBody,
  UserRegisterForm,
} from "../schema/User";
import { LoginResponseBody } from "../schema/Auth";
import { APIErrorResponse } from "../schema/General";
export interface Auth {
  isAuthenticated: boolean;
  user: User;
  setUser: (user: User) => void;
  tryAuthenticateWithUsernamePassword: (
    username: string,
    password: string,
    loginRedirect?: string,
  ) => Promise<boolean>;
  loadAuthState: () => Promise<boolean>;
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

    const res = await fetch(`http://localhost:8001/token`, {
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
      const user: User = await getAuthUserData();
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
      const err: APIErrorResponse = await res.json();
      // Bad response status
      throw new Error(err.detail);
    }
  };

  const tryRegister = async (
    args: UserRegisterForm,
  ): Promise<UserCreateResponse> => {
    const { username, email, bio, birthdate, password, confirmPassword } = args;
    try {
      console.log("args :>> ", args);
      const res = await fetch(`http://localhost:8001/users`, {
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
        console.log("json :>> ", json);
        await tryAuthenticateWithUsernamePassword(username, password);
        setIsAuthenticated(true);
        // const user: User = await getAuthUserData();
        // setUser(user);
        // setTimeout(() => {
        //   router.push("/ ");
        // }, 1000);
      } else {
        console.log("Error: ", res.status);
        sendError("Error registering user. Please try again.");
        return null;
      }
    } catch (error) {
      console.log("Caught error :>> ", error);
      sendError("Error logging in. Please try again.");
      return null;
    }
  };

  const getAuthUserData = async (): Promise<User> => {
    try {
      const res = await fetch(`http://localhost:8001/users/me`, {
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
        return user;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const logout = async () => {
    const res = await fetch(`http://localhost:8001/logout`, {
      method: "GET",
      credentials: "include",
    });
    router.push("/login").then(() => {
      setIsAuthenticated(false);
      setUser(null);
    });
  };

  const loadAuthState = async (): Promise<boolean> => {
    // Try and get the authenticated user data
    const user: User = await getAuthUserData();
    if (user) {
      setIsAuthenticated(true);
      setUser(user);
      return true;
    } else {
      setIsAuthenticated(false);
      setUser(null);
      return false;
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
