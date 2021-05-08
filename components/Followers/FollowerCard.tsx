import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";
import { Follower } from "../../schema/Followers";

interface Props {
  follower: Follower;
}

export const FollowerCard = (props: Props) => {
  const { follower } = props;
  const { user } = useAuth();
  return (
    <div className="mx-auto my-6 bg-white rounded-sm shadow-md overflow-hidden w-full max-w-xl">
      <div className="md:flex">
        <div className="p-4 sm:p-8">
          <Link
            href={`/user/${follower.userId}/`}
            as={`/user/${follower.userId}`}
          >
            <span className="uppercase tracking-wide cursor-pointer text-sm text-lightBlue-500 font-semibold">
              @{follower.username}
            </span>
          </Link>

          {/* <Link
            href={`/user${follower.userId}/`}
            as={`/user/${follower.userId}`}
          >
            <a className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
              {user.email}
            </a>
          </Link> */}
          <p className="mt-2 text-gray-500">{follower.bio}</p>
        </div>
      </div>
    </div>
  );
};
