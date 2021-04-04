import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { useAlert } from "../hooks/useAlert";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { sendAlert, sendError } = useAlert();

  const router = useRouter();

  const { tryAuthenticateWithUsernamePassword } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  let redirect: string = "/";

  useEffect(() => {
    if (router.query["redirect"]) {
      redirect = router.query["redirect"].toString();
      console.log("Redirect String", redirect)
    }
  }, [router.isReady]);

  return (
    <Layout pageTitle="Please Log In" noAuth>
      <form
        className="mt-4 mx-auto my-4 py-8 form grid grid-col1 gap-y-2 rounded-sm w-full max-w-lg  justify-evenly align-center shadow-md bg-lightBlue-700"
        name="loginForm"
        method="GET"
        action="#"
        onSubmit={async (e) => {
          e.preventDefault();
          if (
            await tryAuthenticateWithUsernamePassword(
              username,
              password,
              router.query["redirect"]?.toString()
            ) === false
          ) {
            // Failed
            sendError("Error logging in")
          } else {
            // Success
            sendAlert("Welcome")
          }
          
        }}
      >
        <div className="flex flex-col w-auto  m-auto text-white  text-xl">
          <label htmlFor="email">Username/Email</label>
          <input
            className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1 "
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col mx-auto mt-2 text-white text-xl ">
          <label htmlFor="password">Password</label>
          <input
            className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>

        <div className="flex mx-4 my-6 border-b col-span-1 sm:col-span-2"></div>
        <Button
          onClick={() => router.push("/register")}
          type="button"
          color="white"
          className="text-2xl mt-4 col-span-1 sm:col-span-1"
        >
          Register New Account
        </Button>

        <Button
          type="submit"
          color="green"
          className="text-2xl mt-4 col-span-1 sm:col-span-1"
        >
          Login
        </Button>

      </form>
    </Layout>
  );
}
