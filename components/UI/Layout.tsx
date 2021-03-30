// import { useIsLoading } from "../../hookes/us";
// import { LoginForm } from "./Auth/LoginForm";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "./Button";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { MainTitle } from "./MainAppTitle";
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
      <div className="flex flex-none px-2 py-2 w-full h-20 items-center justify-between shadow-lg bg-blue-600 text-white">
        <MainTitle />
        {isAuthenticated ? (
          <LogoutButton />
        ) : router.asPath.includes("login") ? (
          <></>
        ) : (
          <LoginButton />
        )}
      </div>

      <div className="flex-1 flex overflow-hidden bg-gray-700 ">
        <div className="hidden md:flex md:flex-col w-64 flex-shrink-0 justify-center px-6 py-8 bg-white shadow-lg">
          {/* Left Sidebar */}
          <Button color="blue">Tweets</Button>
          <Button color="blue">Likes</Button>
          <Button color="blue">Profile</Button>
        </div>

        {/* Scroll Wrapper */}
        <div className="flex flex-1  ">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </main>
  );
};
// <div className="hidden md:flex md:flex-col flex-shrink-0 w-40 my-8 py-8">
//   {/* Right Sidebar */}
//   <h2>Recommendations</h2>
// </div>
