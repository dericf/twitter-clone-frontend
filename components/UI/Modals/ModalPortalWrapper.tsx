import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export const ModalPortalWrapper = ({ children }) => {
  // Local State
  const [isBrowser, setIsBrowser] = useState(false);

  // Lifecycles
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  if (isBrowser) {
    return ReactDOM.createPortal(
      children,
      document.getElementById("modal-root"),
    );
  } else {
    return null;
  }
};
