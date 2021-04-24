import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { Button } from "../components/UI/Button";
import { Layout } from "../components/UI/Layout";

const ConfirmEmailPage: NextPage = () => {
  return (
    <Layout pageTitle="Success! Your email is confirmed">
      <p>Success! Your email is confirmed</p>
      <Button>
        <Link href="/login" as="/login">
          <span>Login</span>
        </Link>
      </Button>
    </Layout>
  );
};

export default ConfirmEmailPage;
