import { GetServerSideProps, NextPage } from "next";
import { Layout } from "../components/UI/Layout";

const ConfirmEmailPage: NextPage = () => {
  return (
    <Layout pageTitle="Error! Something went wrong.">
      <p>Error! Something went wrong.</p>
    </Layout>
  );
};

export default ConfirmEmailPage;
