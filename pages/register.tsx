import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { useAlert } from "../hooks/useAlert";
import { useAuth } from "../hooks/useAuth";
import { UserCreateRequestBody, UserRegisterForm } from "../schema/User";

export default function Register() {
  const { sendAlert, sendError } = useAlert();

  const router = useRouter();

  const { tryRegister } = useAuth();

  // conshandleFormChange;
  // const [email, setEmail] = useState<string>("");
  // const [password, handleFormChange] = useState<string>("");
  // const [confirm, setConfirm] = useState<string>("");
  // const [bio, setBio] = useState<string>("");
  // const [birthdate, setBirthdate] = useState<string>("");

  const [form, setForm] = useState<UserRegisterForm>({
    username: "",
    email: "@email.com",
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
    console.log("Registering :>> ", {
      username: form.username,
      password: form.password,
      confirmPassword: form.confirmPassword,
      email: form.email,
      bio: form.bio,
      birthdate: form.birthdate,
    });

    if (form.password !== form.confirmPassword) {
      sendError("Passwords do not match!");
      return false;
    }

    await tryRegister({
      username: form.username,
      password: form.password,
      email: form.email,
      bio: form.bio,
      birthdate: form.birthdate,
    });
  };

  return (
    <Layout
      pageTitle="Register a New Account"
      onAuthSuccess={() => console.log("Auth was as ")}
      noAuth={true}
    >
      {/* <h3 className="text-4xl text-center text-white mb-4">Please Log In</h3> */}
      <form
        className="my-4 mx-auto py-8 px-8 form 
        flex flex-col
        justify-stretch align-start
        w-full max-w-2xl
        text-white text-xl
        shadow-lg bg-lightBlue-700
        rounded-sm 
        "
        name="registerForm"
        method="POST"
        action="#"
        onSubmit={handleRegister}
      >
        <div className="flex flex-row justify-between space-x-8 flex-wrap sm:flex-nowrap">
          <div className="flex flex-col space-y-4 justify-center items-stretch  place-self-start  w-80">
            <div className="flex flex-col">
              <label htmlFor="email">Username</label>
              <input
                className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1 w-48 "
                type="text"
                name="username"
                value={form.username}
                onChange={handleFormChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                className="text-gray-900 px-4 py-2  focus:bg-gray-200 mt-1"
                type="text"
                placeholder="e.g. you@email.com"
                name="email"
                value={form.email}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4  justify-center items-stretch place-self-start w-80 max-w-full">
            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1"
                type="password"
                name="password"
                value={form.password}
                onChange={handleFormChange}
              />
            </div>
            <div className="flex flex-col justify-center items-stretch place-self-start w-80 max-w-full">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleFormChange}
              />
            </div>
          </div>
        </div>
        {/* Horizontal Line */}
        {/* <div className="flex mx-4 my-6 border-b col-span-1 sm:col-span-2"></div> */}

        {/* <div className="flex h-0 mx-4 my-6 border-b col-span-1 justify-self-center  sm:col-span-2"></div> */}
        <div className="flex flex-col justify-center items-stretch mt-4">
          <label htmlFor="confirmPassword">Bio (Optional)</label>
          <textarea
            className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1"
            name="bio"
            value={form.bio}
            rows={4}
            onChange={handleFormChange}
          ></textarea>
        </div>

        <div className="flex flex-col justify-center items-stretch place-self-center mt-4 w-48 max-w-full">
          <label htmlFor="birthdate">Birthdate</label>
          <input
            className="text-gray-900 px-4 py-2 focus:bg-gray-200 mt-1 text-center w-max"
            type="date"
            name="birthdate"
            value={form.birthdate}
            placeholder="e.g. 1980-10-20"
            onChange={handleFormChange}
          />
        </div>

        <div className="flex flex-col sm:flex-row space-y-4  -mb-8 mt-4 -mx-8">
          <Button
            onClick={() => router.push("/login")}
            type="button"
            color="transparent"
            className="text-2xl mt-4 py-4"
            fluid
            addMargins={false}
          >
            Log In Instead
          </Button>

          <Button
            type="submit"
            color="green"
            className="text-2xl mt-4 py-4"
            fluid
            addMargins={false}
            disabled={
              form.username.length === 0 ||
              form.email.length === 0 ||
              !form.email.includes("@") ||
              form.password.length === 0 ||
              form.confirmPassword.length === 0 ||
              form.password != form.confirmPassword
            }
          >
            Register
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </Button>
        </div>
      </form>
    </Layout>
  );
}
