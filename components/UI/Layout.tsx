// import { useIsLoading } from "../../hookes/us";
// import { LoginForm } from "./Auth/LoginForm";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { MainTitle } from "./MainAppTitle";
// import LoadingBackdrop from "./LoadingBackdrop";

export const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <main className=" py-2 px-2 lg:px-3 mx-auto min-h-screen flex flex-col justify-start align-middle overflow-y-auto bg-blue-900 text-gray-200">
      <div className="flex w-full h-20 items-center justify-between">
        <MainTitle />
        {isAuthenticated ? (
          <LogoutButton />
        ) : router.asPath.includes("login") ? (
          <></>
        ) : (
          <LoginButton />
        )}
      </div>

      {children}

      {/* {loadingState?.overlay && <LoadingBackdrop />} */}
    </main>
  );
};
