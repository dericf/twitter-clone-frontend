import { GetServerSideProps, NextPage } from "next";
import { Layout } from "../components/UI/Layout";

const ConfirmEmailPage: NextPage = () => {
  return (
    <Layout pageTitle="Error! Something went wrong.">
      <p className="text-white">Error! Something went wrong.</p>
    </Layout>
  );
};

export default ConfirmEmailPage;
