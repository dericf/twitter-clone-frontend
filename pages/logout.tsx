import { Layout } from "../components/UI/Layout";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
interface Props {}

export default function Discover(props: Props) {
  const { logout } = useAuth();
  useEffect(() => {
    (async () => {
      await logout();
    })().catch((err) => {
      console.error(err);
    });
  }, []);
  return (
    <Layout pageTitle="" silentAuth isProtected={false}>
      ...
    </Layout>
  );
}
