import { Dispatch, FunctionComponent, SetStateAction } from "react";

interface Props {
  closeModal: () => void;
}

export const ModalBackdrop: FunctionComponent<Props> = ({
  closeModal,
  children,
}) => {
  return (
    <div
      className="fixed bottom-0 left-0 top-0 right-0 backdrop-blur-md z-40 "
      onClick={closeModal}
    >
      {children}
    </div>
  );
};
