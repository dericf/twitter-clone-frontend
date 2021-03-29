import React, { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/router";
import { Layout } from "../UI/Layout";
import { LoadingSpinner } from "../UI/LoadingSpinner";

export const Protected = (props) => {
  const { isAuthenticated, loadAuthState } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      // console.log("Checking auth status.");
      const userIsStillAuth = await loadAuthState();
      // console.log("Session still valid? ", userIsStillAuth);

      if (userIsStillAuth === false) {
        router.push("/login");
      }
    };

    if (isAuthenticated === false) {
      // Check if there is a saved token in localstorage
      checkAuth();
    }
  }, []);

  if (isAuthenticated === true) {
    return props.children;
  }
  return (
    <Layout>
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner></LoadingSpinner>
      </div>
    </Layout>
  );
};
