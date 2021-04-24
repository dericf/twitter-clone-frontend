import { Layout } from "../components/UI/Layout";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAlert } from "../hooks/useAlert";
interface Props {}

export default function Discover(props: Props) {
  const { logout } = useAuth();
  const { sendAlert, sendError } = useAlert();
  useEffect(() => {
    (async () => {
      await logout();
      sendAlert("You have been logged out.");
    })().catch((err) => {
      console.error(err);
      sendError("There was an error logging you out. Please try again.");
    });
  }, []);
  return (
    <Layout pageTitle="" silentAuth isProtected={false}>
      ...
    </Layout>
  );
}
