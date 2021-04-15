import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { useAlert } from "../hooks/useAlert";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const router = useRouter();

  // Custom hooks
  const { sendAlert, sendError } = useAlert();
  const { tryAuthenticateWithUsernamePassword } = useAuth();

  // Local state
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  let redirect: string = "/";

  useEffect(() => {
    if (router.query["redirect"]) {
      redirect = router.query["redirect"].toString();
    }
  }, [router.isReady]);

  return (
    <Layout pageTitle="Please Log In" noAuth>
      <form
        className="mt-4 rounded-sm w-full max-w-md shadow-lg bg-lightBlue-700"
        name="loginForm"
        method="GET"
        action="#"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await tryAuthenticateWithUsernamePassword(
              username,
              password,
              router.query["redirect"]?.toString(),
            );
            // Success
            sendAlert("Welcome");
          } catch (error) {
            sendError(`Error logging in. ${error.message}`);
          }
        }}
      >
        <div className="py-8 px-6">
          <div className="flex flex-col mx-6 text-white">
            <label htmlFor="email" className="text-md">
              Username/Email
            </label>
            <input
              autoFocus
              className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1 "
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-col mx-6  text-white mt-4 ">
            <label htmlFor="password" className="text-md">
              Password
            </label>
            <input
              className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1 "
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
        </div>
        {/* <div className="flex my-6 border-b col-span-1 sm:col-span-2"></div> */}
        <div className="flex flex-col sm:flex-row mt-2">
          <Button
            onClick={() => router.push("/register")}
            type="button"
            color="transparent"
            className="text-sm items-center flex-1 mx-0 my-0 py-4 text-trueGray-300"
            addMargins={false}
          >
            Register New Account
          </Button>

          <Button
            type="submit"
            color="white"
            className="flex-1 items-center mx-0 my-0 py-4 text-white text-md"
            disabled={username.length === 0 || password.length === 0}
            addMargins={false}
          >
            Login
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform rotate-180 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </Button>
        </div>
      </form>
    </Layout>
  );
}
