import Link from "next/link";
import React, { FunctionComponent } from "react";
import { useStore } from "../../../hooks/useStore";
import { PageId } from "../../../schema/Navigation";

type PropType = JSX.IntrinsicAttributes &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;
interface Props extends PropType {
  pageId: PageId;
}

export const BottomNavLink: FunctionComponent<Props> = ({
  href,
  onClick,
  children,
  pageId,
  ...props
}) => {
  let colorClasses = "";
  const { activePage } = useStore();

  return (
    <Link href={href} as={href}>
      <button
        className={`py-4 px-2 shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 text-white focus:ring-lightBlue-900 
        hover:bg-lightBlue-800  text-xs sm:text-sm flex-grow mx-auto rounded-none flex items-center justify-center 
        ${pageId === activePage ? "bg-lightBlue-800 " : "bg-lightBlue-600 "}
        `}
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
