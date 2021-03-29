import { useToasts } from "react-toast-notifications";

export const useAlert = () => {
  const { addToast } = useToasts();

  const sendAlert = (text) => {
    addToast(text, { appearance: "success", autoDismiss: true });
  };

  const sendError = (text) => {
    addToast(text, { appearance: "error", autoDismiss: true });
  };

  const sendInfo = (text) => {
    addToast(text, { appearance: "info", autoDismiss: true });
  };

  return {
    sendAlert,
    sendError,
    sendInfo,
  };
};