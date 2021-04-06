import React, {
  FunctionComponent,
  PropsWithChildren,
  ReactChildren,
} from "react";

type ButtonColor = "white" | "blue" | "green" | "red" | "transparent";

type PropType = JSX.IntrinsicAttributes &
  React.ButtonHTMLAttributes<HTMLButtonElement>;
interface Props extends PropType {
  color?: ButtonColor;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  icon?: JSX.Element;
  fluid?: boolean;
  link?: string | null;
  animated?: boolean;
}

export const Button: FunctionComponent<Props> = ({
  color = "white",
  loading = false,
  className = "",
  disabled = false,
  // onClick = () => {},
  children,
  type = "button",
  icon,
  fluid = false,
  link = null,
  animated = false,
  ...props
}) => {
  let colorClasses = "";
  const { key } = props;
  switch (color) {
    case "blue":
      colorClasses = `text-white bg-lightBlue-700 focus:ring-lightBlue-900 hover:bg-lightBlue-800`;
      break;
    case "white":
      colorClasses = `text-blueGray-700 bg-white border focus:ring-blueGray-100 hover:bg-blueGray-800 hover:text-white`;
      break;
    case "green":
      colorClasses = `text-white bg-emerald-500 focus:ring-emerald-400 hover:bg-emerald-700`;
      break;
    case "red":
      colorClasses = `text-white bg-red-500 focus:ring-red-400 hover:bg-red-700`;
      break;
    case "transparent":
      colorClasses = `focus:ring-white hover:bg-trueGray-800 hover:text-white`;
      break;
    default:
      break;
  }
  return (
    <button
      disabled={disabled}
      className={`flex justify-center align-middle 
      ${
        disabled === true
          ? "opacity-30 cursor-not-allowed !hover:bg-rose-800:"
          : ""
      }
      ${animated ? "transform hover:-translate-y-0.5" : ""}
      text-sm py-2 px-4 mx-2 my-2 ${colorClasses} font-semibold rounded-sm ${
        color === "transparent" ? "shadow-none" : "shadow-md"
      } focus:outline-none focus:ring-2 focus:ring-opacity-75 
      ${fluid ? "flex-grow w-full" : ""}
      ${className}`}
      type={type}
      // onClick={onClick}
      {...props}
    >
      {/* {icon && icon} */}
      {loading ? (
        <>
          <svg
            className="h-5 w-5 mr-3 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          disabled
        </>
      ) : (
        children
      )}
    </button>
  );
};
