import React, { useState, useContext, createContext } from "react";
import { useAlert } from "./useAlert";
import { useRouter } from "next/router";
import { User } from "../schema/User";
export interface Auth {
  isAuthenticated: boolean;
  user: User;
  tryAuthenticateWithUsernamePassword: (
    username: string,
    password: string,
    loginRedirect?: string,
  ) => Promise<boolean>;
  loadAuthState: () => Promise<boolean>;
  logout: () => void;
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
    try {
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
        const json = await res.json();
        console.log("Cookie: ", document.cookie);
        console.log("json :>> ", json);
        setIsAuthenticated(true);
        const user: User = await getAuthUserData();
        setUser(user);
        router.push(loginRedirect);
      } else {
        console.log("Error: ", res.status);
        sendError("Error logging in. Please try again.");
        return false;
      }
    } catch (error) {
      console.log("Caught error :>> ", error);
      sendError("Error logging in. Please try again.");
      return false;
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
        sendAlert("Successfully loaded user session");
        return user;
      } else {
        sendError(
          "There was an issue getting your user session. Please refresh the page.",
        );
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
    setIsAuthenticated(false);
    setUser(null);
    router.push("/");
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
        tryAuthenticateWithUsernamePassword,
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
