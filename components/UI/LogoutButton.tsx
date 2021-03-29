import { useAuth } from "../../hooks/useAuth";
import { Button } from "./Button";

export const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button color="white" onClick={logout}>
      Logout
    </Button>
  );
};
