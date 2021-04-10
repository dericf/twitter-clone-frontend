import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "./Button";

export const RegisterButton = () => {
  const router = useRouter();

  return (
    <Button color="transparent" onClick={() => router.push("/register")}>
      Sign Up
    </Button>
  );
};
