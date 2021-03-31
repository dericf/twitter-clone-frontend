// import { useIsLoading } from "../../hookes/us";
// import { LoginForm } from "./Auth/LoginForm";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "./Button";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { MainTitle } from "./MainAppTitle";
import Link from "next/link";

import { MobileBottomNav } from "./Nav/MobileBottomNav";
import { LeftSidebar } from "./Nav/LeftSidebarNav";
import { NewTweetButton } from "../Tweets/NewTweetButton";
// import LoadingBackdrop from "./LoadingBackdrop";

export const Layout = ({ children }) => {
  const { user, isAuthenticated, loadAuthState } = useAuth();

  const router = useRouter();
  useEffect(() => {
    if (user === null) {
      (async () => {
        await loadAuthState();
      })().catch((err) => {
        console.error(err);
      });
    }
  }, []);

  return (
    <main className=" w-screen h-screen flex flex-col overflow-hidden">
      <div className="flex flex-none px-2 py-2 w-full h-20 items-center justify-between shadow-lg bg-blue-500 text-white">
        <MainTitle />
        {isAuthenticated ? (
        <div className="flex">
        <NewTweetButton />
        <LogoutButton />
        </div>
        ) : router.asPath.includes("login") ? (
          <></>
        ) : (
          <LoginButton />
        )}
      </div>

      <div className="flex-1 flex overflow-hidden bg-gray-700 ">
        <nav className="hidden sm:flex flex-col w-24 sm:w-40 md:w-52 flex-shrink-0 justify-center px-0.5 sm:px-3 md:px-6 py-6 bg-white shadow-lg">
          <LeftSidebar />
        </nav>

        {/* Scroll Wrapper */}
        <div className="flex flex-1 mx-6">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto justify-between sm:pb-12">
            {children}
            <nav className="fixed sm:hidden flex justify-between items-center  bottom-0 w-screen h-12 -mx-6 flex-grow flex-shrink-0">
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
