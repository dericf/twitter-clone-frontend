import React, {
  FunctionComponent,
  PropsWithChildren,
  ReactChildren,
} from "react";

import Link from "next/link";

type PropType = JSX.IntrinsicAttributes &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;
interface Props extends PropType {
  isActiveLink: boolean;
}

export const SidebarLink: FunctionComponent<Props> = ({
  href,
  onClick,
  children,
  isActiveLink = null,
  ...props
}) => {

  return (
    <Link href={href} as={href}>
      <button
        className={`py-2 px-4 mx-2 my-2 font-semibold rounded-md shadow-md 
        focus:outline-none 
        focus:ring-2 
        focus:ring-opacity-75 text-white 
        focus:ring-lightBlue-900 
        
        
        ${isActiveLink ? "bg-lightBlue-800 " : "bg-lightBlue-700 "}
        hover:bg-lightBlue-800 

        text-xs sm:text-sm md:text-lg 
        flex justify-between flex-none justify-self-start align-middle`}
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
