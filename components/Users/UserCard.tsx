import { useAuth } from "../../hooks/useAuth";
import { EditUserInfoButton } from "./EditUserInfoModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { dateFormat } from "../../utilities/dates";

export const UserProfileCard = () => {
  const { user } = useAuth();
  return (
    <div className="mx-auto my-6 bg-white rounded-sm shadow-md overflow-hidden w-full max-w-xl">
      <div className="md:flex">
        <div className="flex md:flex-shrink-0 justify-center pl-8 items-center">
          {/* <img
            className="h-48 w-full object-cover md:w-48"
            src="/img/store.jpg"
            alt="Man looking at item at a store"
          /> */}

          <svg
            className="w-full h-24 md:w-24 mx-auto self-center text-blueGray-700"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="p-8 flex-1">
          <div className="tracking-wide text-sm text-lightBlue-500 font-semibold flex flex-col sm:flex-row justify-between items-center">
            <div className="flex flex-col">
              <span className="uppercase">{user.username}</span>

              <p className="block mt-1 text-sm leading-tight font-medium text-blueGray-700">
                {user.email}
              </p>
              <p className="block mt-1 text-xs leading-tight font-normal text-blueGray-400">
                Born {dateFormat(user.birthdate)}
              </p>
            </div>
            {user && (
              <div className="flex items-center">
                <EditUserInfoButton />
                <DeleteUserModal />
              </div>
            )}
          </div>

          <div className="mt-2 py-2 text-blueGray-500">
            {user.bio.split("\n").map((line, index) => (
              <p key={line + index}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
