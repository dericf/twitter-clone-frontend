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

interface ConfirmModalProps {
  showModal: boolean;
  title?: string;
  message?: string;
  confirmDisabled?: boolean;
  setShowModal: (_: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmModal: FunctionComponent<ConfirmModalProps> = (props) => {
  // Destructure Props
  const {
    showModal,
    setShowModal,
    onConfirm,
    onCancel,
    title = "Confirm",
    message = "Are you sure you want to continue?",
    confirmDisabled = false,
  } = props;

  const handleConfirm = async () => {
    await onConfirm();
    // setShowModal(false);
  };

  const handleCancel = async () => {
    if (onCancel) {
      await onCancel();
    }
    setShowModal(false);
  };

  // On Submit
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setShowModal(false);
    await handleConfirm();
  };

  const closeOnEscape = async (e) => {
    if (e.key === "Escape") {
      await handleCancel();
    }
  };
  // On modal shown
  useEffect(() => {
    if (document) document?.addEventListener("keydown", closeOnEscape, false);

    return () => {
      if (document)
        document?.removeEventListener("keydown", closeOnEscape, false);
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-0 left-0 top-0 right-0 backdrop-blur-md z-10">
        <div
          className="
            mx-auto p-0 rounded-sm 
            fixed
            top-[25%]
            bottom-[25%]
            left-0 sm:left-[25%]
            right-0 sm:right-[25%]
            max-h-60
            z-20 shadow-xl
            backdrop-filter
            bg-white"
        >
          <form
            action="post"
            onSubmit={handleSubmit}
            className="flex flex-col justify-between text-center pt-4 w-full h-full"
          >
            <h4 className="text-4xl text-gray-900 mb-2">{title}</h4>
            {message && (
              <div className="flex justify-center items-center font-normal text-md normal-case text-black py-6">
                {message}
              </div>
            )}

            {props.children && (
              <div className="flex justify-center items-center">
                {props.children}
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex justify-between py-0">
                <Button
                  color="white"
                  onClick={handleCancel}
                  type="submit"
                  className="flex-grow border-none rounded-none"
                  addMargins={false}
                >
                  Cancel
                </Button>

                <Button
                  color="blue"
                  type="submit"
                  disabled={confirmDisabled}
                  className="flex-grow border-none rounded-none"
                  addMargins={false}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
