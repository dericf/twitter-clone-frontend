import {
  FormEventHandler,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { Button } from "../UI/Button";

import { useAlert } from "../../hooks/useAlert";
import { useStore } from "../../hooks/useStore";
import { User } from "../../schema/User";
import { useAuth } from "../../hooks/useAuth";
import { deleteUser, updateUser } from "../../crud/users";

import { ConfirmModal } from "../UI/Modals/ConfirmModal";

interface PropType extends JSX.IntrinsicAttributes {}

export const DeleteUserModal: FunctionComponent<PropType> = (props) => {
  const router = useRouter;
  const { sendAlert, sendError } = useAlert();

  const passwordRef = useRef<HTMLInputElement>();

  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const tryDeleteUser = async () => {
    try {
      const { value, error } = await deleteUser(password);
      if (error) throw new Error(error.errorMessageUI);
      sendAlert("Success. Your account has been deleted.");
      await logout();
    } catch (error) {
      sendError(error);
    }
  };

  useEffect(() => {
    if (showModal && passwordRef) {
      passwordRef?.current?.focus();
    }
  }, [showModal]);

  return (
    <>
      <Button
        color="white"
        onClick={() => setShowModal(true)}
        title="Delete Your Account"
        className="flex items-center"
        animated
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Delete
      </Button>
      {showModal && (
        <ConfirmModal
          title="Delete your account"
          showModal={showModal}
          setShowModal={setShowModal}
          onConfirm={tryDeleteUser}
          confirmDisabled={password.length === 0}
        >
          <div className="flex flex-col items-center">
            <input
              ref={passwordRef}
              className="bg-blueGray-600 px-4 py-2 text-white text-center"
              type="password"
              name="password"
              placeholder="Confirm password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
        </ConfirmModal>
      )}
    </>
  );
};
