import { useToasts } from "react-toast-notifications";

export const useAlert = () => {
  const { addToast, toastStack } = useToasts();

  const sendAlert = (text: string) => {
    addToast(text, { appearance: "success", autoDismiss: true });
  };

  const sendError = (text: string | Error) => {
    text = String(text);
    let duplicate = false;
    toastStack.forEach((toast) => {
      if (toast.content === text) {
        duplicate = true;
        return;
      }
    });
    duplicate === false &&
      addToast(text, { appearance: "error", autoDismiss: true });
  };

  const sendInfo = (text: string) => {
    addToast(text, { appearance: "info", autoDismiss: true });
  };

  return {
    sendAlert,
    sendError,
    sendInfo,
  };
};
