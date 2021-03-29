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
        className="form flex flex-col max-w-md mx-auto my-2 justify-evenly h-1/4"
        name="loginForm"
        method="POST"
        action="#"
        onSubmit={async (e) => {
          e.preventDefault();
          await tryAuthenticateWithUsernamePassword(username, password)
        }}
      >
        <div className="flex flex-col w-10/12 mx-auto ">
          <label htmlFor="email">Username/Email</label>
          <input
            className="text-gray-900 px-4 py-2 focus:hover:active:bg-blue-300 "
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col w-10/12 mx-auto ">
          <label htmlFor="password">Password</label>
          <input
            className="text-gray-900 px-4 py-2"
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
