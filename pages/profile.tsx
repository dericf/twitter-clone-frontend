import Head from "next/head";
import { useState } from "react";
import { Protected } from "../components/Auth/Protected";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";
import { useAlert } from "../hooks/useAlert";
import { useAuth } from "../hooks/useAuth";
import { UserProfileCard } from "../components/Users/UserCard";

export default function Profile() {
  const { sendAlert, sendError } = useAlert();

  const { user, isAuthenticated } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <Layout pageTitle="User Profile" isProtected={true}>
      <UserProfileCard></UserProfileCard>
    </Layout>
  );
}
