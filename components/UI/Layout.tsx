// TODO: organize imports
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
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
import { LoadingOverlay } from "./LoadingOverlay";
import { useAlert } from "../../hooks/useAlert";
import Head from "next/head";
import { useStore } from "../../hooks/useStore";
import { useEmitter } from "../../hooks/useEmitter";
import { WSMessage } from "../../schema/WebSockets";

import WSC from "../../websocket/client";
import { Message } from "../../schema/Messages";
import { ChatBar } from "../Chat/ChatBar";
import ChatContextProvider from "../../hooks/useChat";

import { HamburgerIcon } from "../ui/Icons/HamburgerIcon";

// TODO: Add proper Prop Types
export const Layout = ({
  children,
  isProtected = false,
  noAuth = false,
  silentAuth = true,
  pageTitle = null,
  tabTitle = pageTitle,
  onAuthSuccess = () => {},
  loading = false,
}) => {
  const { user, isAuthenticated, loadAuthState } = useAuth();
  const { sendError, sendAlert } = useAlert();
  const [isLoading, setLoading] = useState(loading || !user);
  const { activePage, setActivePage, showSidebar, setShowSidebar } = useStore();

  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);

  const router = useRouter();

  const { emitter } = useEmitter();

  useEffect(() => {
    const path = router.asPath;

    if (path === "/") {
      setActivePage("discover");
    } else if (path === "/tweets") {
      setActivePage("tweets");
    } else if (path === "/likes") {
      setActivePage("likes");
    } else if (path === "/profile") {
      setActivePage("profile");
    } else if (path === "/comments") {
      setActivePage("comments");
    } else if (path.startsWith("/messages")) {
      setActivePage("messages");
    } else if (path === "/following") {
      setActivePage("following");
    } else if (path === "/followers") {
      setActivePage("followers");
    } else {
      setActivePage("");
    }

    if (noAuth === true) {
      // Skip user auth check - return right away
      setLoading(false);
      return () => {};
    }
    if (user === null) {
      // Try and load the user if credentials exist and are still valid
      (async () => {
        const { value: isAuth, error } = await loadAuthState();

        if (error && isProtected === true) {
          // Auth is required and the current user object could not be fetched
          // credentials are either missing or expired
          //
          // Redirect to /login and save the redirect url to come back
          router
            .push(`/login?redirect=${router.asPath.toString()}`)
            .then((_) => {
              sendError(error.errorMessageUI);
            });
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
  }, [router.isReady, user]);

  return (
    <>
      <Head>
        <title>Twitter Clone | {tabTitle}</title>
      </Head>
      <main className=" w-screen h-screen flex flex-col overflow-hidden">
        <div className="flex flex-none px-2 py-2 w-full h-20 items-center justify-between shadow-xl  border-none bg-lightBlue-700 text-white">
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

        <div className="flex-1 flex overflow-hidden z-20 ">
          {showSidebar && (
            <nav className="hidden sm:flex flex-col w-28 sm:w-44 md:w-56 flex-shrink-0 justify-center px-0.5 sm:px-3 md:px-6 py-6 bg-white shadow-lg">
              <LeftSidebar showNewMessageAlert={showNewMessageAlert} />
            </nav>
          )}
          <div className="flex items-center fixed bottom-12 left-0 sm:bottom-0">
            <Button
              addMargins={false}
              className="hidden sm:flex"
              onClick={() => setShowSidebar(!showSidebar)}
              title="Show/Hide Sidebar"
            >
              <HamburgerIcon />
            </Button>

            {user && (
              <ChatContextProvider>
                <ChatBar />
              </ChatContextProvider>
            )}
          </div>

          {/* Scroll Wrapper */}
          <div className="flex flex-1 pb-12 sm:pb-0 bg-blueGray-700">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto justify-between ">
              {pageTitle && (
                <h3 className=" text-3xl md:text-4xl text-center text-white my-4">
                  {pageTitle}
                </h3>
              )}
              <div className="flex flex-col w-full h-full px-2 sm:px-4 max-w-6xl mx-auto items-center justify-items-center">
                {isLoading ? <LoadingOverlay /> : children}
              </div>

              <nav className="fixed sm:hidden flex justify-between items-center  bottom-0 w-screen h-12 flex-grow flex-shrink-0 ">
                <MobileBottomNav showNewMessageAlert={showNewMessageAlert} />
              </nav>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
// <div className="hidden md:flex md:flex-col flex-shrink-0 w-40 my-8 py-8">
//   {/* Right Sidebar */}
//   <h2>Recommendations</h2>
// </div>
