import Link from "next/link";
import React, { FunctionComponent } from "react";

type PropType = JSX.IntrinsicAttributes &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;
interface Props extends PropType {}

export const BottomNavLink: FunctionComponent<PropType> = ({
  href,
  onClick,
  children,
  ...props
}) => {
  let colorClasses = "";

  return (
    <Link href={href} as={href}>
      <button
        className={`py-2 my-2 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 text-white bg-lightBlue-700 focus:ring-lightBlue-900 hover:bg-lightBlue-800  text-xs sm:text-sm md:text-lg flex-grow mx-auto rounded-none px-2 mb-0 flex items-center justify-center `}
        type="button"
        onClick={onClick}
        {...props}
      >
        {/* {icon && icon} */}

        {children}
      </button>
    </Link>
  );
};
