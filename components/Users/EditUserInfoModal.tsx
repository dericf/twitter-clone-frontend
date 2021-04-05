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
import { updateUser } from "../../crud/users";

interface EditUserInfoModalPropType {
  showModal: boolean;
  setShowModal: (_: boolean) => void;
}

const EditUserInfoModal: FunctionComponent<EditUserInfoModalPropType> = (
  props,
) => {
  // Destructure Props
  const { showModal, setShowModal } = props;
  const { user, setUser } = useAuth();

  // Local State
  const [newBio, setNewBio] = useState(user.bio);
  const [newUsername, setNewUsername] = useState(user.username);
  const [password, setPassword] = useState("");

  // Use Store/Context
  // const { createTweet, updateTweetContent } = useStore();

  // Toast Notif.
  const { sendAlert, sendError } = useAlert();

  // Ref
  const inputRef = useRef<HTMLTextAreaElement>();

  // On Submit
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        password,
        newBio: newBio === user.bio ? null : newBio,
        newUsername: newUsername === user.username ? null : newUsername,
      });
      setUser({ ...user, bio: newBio, username: newUsername });
      setShowModal(false);
    } catch (error) {
      // Handle any errors here
      sendError(`${error}`);
    }
  };

  const closeOnEscape = (e) => {
    if (e.key === "Escape") {
      props.setShowModal(false);
    }
  };
  // On modal shown
  useEffect(() => {
    if (document) document?.addEventListener("keydown", closeOnEscape, false);

    if (props.showModal === true && inputRef) {
      inputRef.current?.focus();
    }
    return () => {
      if (document)
        document?.removeEventListener("keydown", closeOnEscape, false);
    };
  }, [props.showModal]);

  return (
    <>
      <div className="fixed bottom-0 left-0 top-0 right-0 px-4 backdrop-blur-md z-10">
        <div
          className="flex flex-col justify-center items-center
            mx-auto p-8 rounded-lg 
            fixed 
            left-0 md:left-1/4 
            right-0 md:right-1/4
            top-[10%]
            z-20 shadow-xl 
            backdrop-filter
            bg-white"
        >
          <h4 className="text-4xl text-gray-900 mb-2">Edit User Details</h4>
          <form
            action="post"
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-lg space-y-4"
          >
            <div className="flex flex-col">
              <label
                className="font-semibold text-black normal-case "
                htmlFor="password"
              >
                New Bio
              </label>
              <textarea
                ref={inputRef}
                name="newBio"
                className="bg-blueGray-600 tracking-wider flex-grow w-full max-lg  text-lg text-white p-4 mt-1"
                id=""
                value={newBio}
                onChange={(e) => {
                  setNewBio(e.currentTarget.value);
                }}
                rows={5}
              ></textarea>
            </div>

            <div className="flex flex-col">
              <label
                className="font-semibold text-black normal-case "
                htmlFor="password"
              >
                New Username
              </label>
              <input
                className="bg-blueGray-600 px-4 py-2 mt-1 text-white"
                type="text"
                name="newUsername"
                placeholder="New username"
                id="newUsername"
                value={newUsername}
                onChange={(e) => setNewUsername(e.currentTarget.value)}
              />
            </div>

            <div>
              <div className="flex mx-4 my-2 border-b "></div>
            </div>

            <div className="flex flex-col">
              <label
                className="font-semibold text-black normal-case "
                htmlFor="password"
              >
                Confirm Password
              </label>
              <input
                className="bg-blueGray-600 px-4 py-2 mt-1 text-white"
                type="password"
                name="password"
                placeholder="Confirm your password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>

            <div className="flex justify-between py-4">
              <Button
                className="flex-grow"
                color="white"
                onClick={() => props.setShowModal(false)}
                type="submit"
              >
                Cancel
              </Button>

              <Button
                color="blue"
                type="submit"
                className="flex-grow"
                disabled={
                  (newBio === user.bio && newUsername === user.username) ||
                  password.length === 0
                }
              >
                Confirm
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

interface PropType extends JSX.IntrinsicAttributes {}

export const EditUserInfoButton: FunctionComponent<PropType> = (props) => {
  const router = useRouter;

  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <Button color="green" onClick={() => setShowModal(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Edit
      </Button>
      {showModal && (
        <EditUserInfoModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </>
  );
};