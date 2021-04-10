import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "./Button";

export const LoginButton = () => {
  const router = useRouter();

  return (
    <Button color="white" onClick={() => router.push("/login")}>
      Login
    </Button>
  );
};
