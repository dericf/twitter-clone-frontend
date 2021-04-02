import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { useAlert } from "../hooks/useAlert";
import { useAuth } from "../hooks/useAuth";
import { UserCreateRequestBody, UserRegisterForm } from "../schema/User";

export default function Home() {
  const { sendAlert, sendError } = useAlert();

  const router = useRouter()
  
  const { tryRegister } = useAuth();

  // conshandleFormChange;
  // const [email, setEmail] = useState<string>("");
  // const [password, handleFormChange] = useState<string>("");
  // const [confirm, setConfirm] = useState<string>("");
  // const [bio, setBio] = useState<string>("");
  // const [birthdate, setBirthdate] = useState<string>("");

  const [form, setForm] = useState<UserRegisterForm>({
    username: "x-user",
    email: "x@email.com",
    password: "123456",
    confirmPassword: "123456",
    bio: "A Bio...",
    birthdate: "1980-10-21",
  });

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Registering :>> ', {
      username: form.username,
      password: form.password,
      confirmPassword: form.confirmPassword,
      email: form.email,
      bio: form.bio,
      birthdate: form.birthdate
    });
    
    await tryRegister({
      username: form.username,
      password: form.password,
      confirmPassword: form.confirmPassword,
      email: form.email,
      bio: form.bio,
      birthdate: form.birthdate
    });
  }

  return (
    <Layout pageTitle="Register a New Account" onAuthSuccess={() => console.log("Auth was as ")} noAuth={true} >
      {/* <h3 className="text-4xl text-center text-white mb-4">Please Log In</h3> */}
      <form
        className="my-4 mx-auto py-8 px-8 form 
        grid grid-flow-row grid-cols-1  gap-y-2 gap-x-6
        justify-evenly align-center 
        w-full max-w-xl
        text-white text-xl
        shadow-lg bg-lightBlue-700
        rounded-sm 
        "
        name="registerForm"
        method="POST"
        action="#"
        onSubmit={handleRegister}
      >
        <div className="flex flex-col justify-center items-center  place-self-center sm:place-self-center w-48 max-w-full">
          <label htmlFor="email">Username</label>
          <input
            className="text-gray-900 px-4 py-2 w-auto focus:bg-gray-200 mt-1  "
            type="text"
            name="username"
            value={form.username}
            onChange={handleFormChange}
          />
        </div>

        <div className="flex flex-col justify-center items-center place-self-center w-80 max-w-full ">
          <label htmlFor="email">Email</label>
          <input
            className="text-gray-900 px-4 py-2 w-full focus:bg-gray-200 mt-1 "
            type="text"
            placeholder="e.g. you@email.com"
            name="email"
            value={form.email}
            onChange={handleFormChange}
          />
        </div>
        {/* Horizontal Line */}
        <div className="flex mx-4 my-6 border-b col-span-1 sm:col-span-2"></div>

        <div className="flex flex-col justify-center items-stretch place-self-center w-80 max-w-full">
          <label htmlFor="password">Password</label>
          <input
            className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1"
            type="password"
            name="password"
            value={form.password}
            onChange={handleFormChange}
          />
        </div>
        <div className="flex flex-col justify-center items-stretch place-self-center w-80 max-w-full">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleFormChange}
          />
        </div>

        <div className="flex h-0 mx-4 my-6 border-b col-span-1 justify-self-center  sm:col-span-2"></div>

        <div className="flex flex-col justify-center items-stretch place-self-center col-span-1  sm:col-span-2 w-48 max-w-full">
          <label htmlFor="birthdate">Birthdate</label>
          <input
            className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1"
            type="text"
            name="birthdate"
            value={form.birthdate}
            placeholder="e.g. 1980-10-20"
            onChange={handleFormChange}
          />
        </div>
        <div className="flex flex-col justify-center items-stretch col-span-1 sm:col-span-2">
          <label htmlFor="confirmPassword">Bio (Optional)</label>
          <textarea
            className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1"
            name="bio"
            value={form.bio}
            rows={4}
            onChange={handleFormChange}
          ></textarea>
        </div>

        <div className="flex mx-4 my-6 border-b col-span-1 sm:col-span-2"></div>
        <Button
        onClick={() => router.push("/login")}
          type="button"
          color="white"
          className="text-2xl mt-4 col-span-1 sm:col-span-1"
        >
          Log In Instead
        </Button>

        <Button
          type="submit"
          color="green"
          className="text-2xl mt-4 col-span-1 sm:col-span-1"
        >
          Register
        </Button>

      </form>
    </Layout>
  );
}
