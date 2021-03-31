import Head from "next/head";
import { useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { useAlert } from "../hooks/useAlert";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { sendAlert, sendError } = useAlert();

	const {tryAuthenticateWithUsernamePassword} = useAuth()

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <Layout>
      <form
        className="mt-16 form grid grid-col1 gap-y-2 rounded-sm w-full max-w-lg mx-auto my-4 py-4 justify-evenly align-center shadow-md bg-blue-500"
        name="loginForm"
        method="POST"
        action="#"
        onSubmit={async (e) => {
          e.preventDefault();
          await tryAuthenticateWithUsernamePassword(username, password)
        }}
      >
        <div className="flex flex-col w-auto  m-auto text-white  text-xl">
          <h3 className="text-4xl text-white">Please Log In</h3>
          <label htmlFor="email">Username/Email</label>
          <input
            className="text-gray-900 px-4 py-2 focus:bg-gray-200   mt-1 "
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
        <Button type="submit" color="white" className="text-2xl mt-4">
          Login
        </Button>
      </form>
    </Layout>
  );
}
