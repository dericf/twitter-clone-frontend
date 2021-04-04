// import { useIsLoading } from "../../hookes/us";
// import { LoginForm } from "./Auth/LoginForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "./Button";
import { LoginButton } from "./LoginButton";
import { RegisterButton } from "./RegisterButton";
import { LogoutButton } from "./LogoutButton";
import { MainTitle } from "./MainAppTitle";
import Link from "next/link";

import { MobileBottomNav } from "./Nav/MobileBottomNav";
import { LeftSidebar } from "./Nav/LeftSidebarNav";
import { NewTweetButton } from "../Tweets/NewTweetButton";
import { LoadingSpinner } from "./LoadingSpinner";
import { LoadingOverlay } from "./LoadingOverlay";
import { useAlert } from "../../hooks/useAlert";

export const Layout = ({
  children,
  isProtected = false,
  noAuth = false,
  silentAuth = true,
  pageTitle = null,
  onAuthSuccess = () => {},
}) => {
  const { user, isAuthenticated, loadAuthState } = useAuth();
  const { sendError, sendAlert } = useAlert();
  const [loading, setLoading] = useState(!user);

  const router = useRouter();
  useEffect(() => {
    if (noAuth === true) {
      setLoading(false);
      return () => {};
    }
    if (user === null) {
      (async () => {
        const isAuth = await loadAuthState();
        if (isAuth === false && isProtected === true) {
          router.push(`/login?redirect=${router.asPath.toString()}`);
        } else {
          setLoading(false);
          if (!silentAuth) {
            sendError(
              "There was an issue getting your user session. Please refresh the page.",
            );
          }
        }
      })().catch((err) => {
        console.error(err);
        setLoading(false);
        if (isProtected === true) {
          router.push("/login");
        }
      });
    }
  }, [router.isReady]);

  // if (loading === true) {
  //   return <LoadingOverlay />;
  // }

  return (
    <main className=" w-screen h-screen flex flex-col overflow-hidden">
      <div className="flex flex-none px-2 py-2 w-full h-20 items-center justify-between shadow-xl border-lightBlue-800 border-b-2 bg-lightBlue-700 text-white">
        <MainTitle />
        {isAuthenticated ? (
          <div className="flex">
            <NewTweetButton />
            <LogoutButton />
          </div>
        ) : router.asPath.includes("login") ? (
          <></>
        ) : (
          <div className="flex">
            <LoginButton />
            <RegisterButton />
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden ">
        <nav className="hidden sm:flex flex-col w-24 sm:w-40 md:w-52 flex-shrink-0 justify-center px-0.5 sm:px-3 md:px-6 py-6 bg-white shadow-lg">
          <LeftSidebar />
        </nav>

        {/* Scroll Wrapper */}
        <div className="flex flex-1 pb-12 sm:pb-0 bg-blueGray-700">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto justify-between mx-4">
            {pageTitle && (
              <h3 className="text-4xl text-center text-white my-4">
                {pageTitle}
              </h3>
            )}
            {loading ? <LoadingOverlay /> : children}
            <nav className="fixed sm:hidden flex justify-between items-center  bottom-0 w-screen h-12 flex-grow flex-shrink-0 -mx-4">
              <MobileBottomNav />
            </nav>
          </div>
        </div>
      </div>
    </main>
  );
};
// <div className="hidden md:flex md:flex-col flex-shrink-0 w-40 my-8 py-8">
//   {/* Right Sidebar */}
//   <h2>Recommendations</h2>
// </div>
