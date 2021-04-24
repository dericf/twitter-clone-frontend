import { GetServerSideProps, NextPage } from "next";
import React, { useEffect } from "react";
import { Layout } from "../components/UI/Layout";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { confirmAccount } from "../crud/users";

const ConfirmEmailPage: NextPage = () => {
  // useEffect(() => {
  //   (async () => {
  //     const { value, error } = await confirmAccount({
  //       confirmationKey: "ASDASDAsD",
  //     });
  //   })().catch((err) => {
  //     console.error(err);
  //   });
  // }, []);

  return (
    <Layout pageTitle="Check your inbox">
      <p className="text-white">
        You'll be getting an email shortly with a confirmation link.
      </p>
    </Layout>
  );
};

export default ConfirmEmailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { confirmationKey } = context.query as { confirmationKey: string };

  if (!confirmationKey) {
    return {
      props: {},
    };
  }

  const { value, error } = await confirmAccount({
    confirmationKey,
  });

  if (error) {
    return {
      redirect: {
        destination: "/confirm-email-error",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: "/confirm-email-success",
      permanent: false,
    },
  };
};
