import { FunctionComponent } from "react";

interface Props {
  handleClick: () => void;
}
export const CloseIcon: FunctionComponent<Props> = (props) => {
  return (
    <svg
      className="w-5 h-5 hover:shadow-md cursor-pointer absolute right-0 top-0 z-50"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      onClick={props.handleClick}
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
};
