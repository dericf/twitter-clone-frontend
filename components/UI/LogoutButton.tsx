import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "./Button";

export const LogoutButton = () => {
  const router = useRouter();

  return (
    <Button
      color="transparent"
      onClick={() => router.push("/logout")}
      className="text-white"
    >
      Logout
    </Button>
  );
};
