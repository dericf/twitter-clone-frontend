import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { Tweet } from "../../schema/Tweet";
import { dateFormat, timeFormat } from "../../utilities/dates";
import { Button } from "../UI/Button";

interface Props {
  tweet: Tweet;
}

export const TweetCard = ({ tweet }: Props) => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="max-w-md mx-auto my-6 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="md:flex-shrink-0 self-center place-self-center p-4">
          {/* <img
            className="h-48 w-full object-cover md:w-48"
            src="/img/store.jpg"
            alt="Man looking at item at a store"
          /> */}

          <svg
            className="h-20 w-full md:w-32 text-gray-800 self-center"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          <Link as={`/users/${tweet.userId}`} href={`/users/${tweet.userId}`}>

          {tweet.username}
          </Link>
          </div>
          
          
            <span
              className="block mt-1 text-lg leading-tight font-medium text-black"
              >
              {dateFormat(tweet.createdAt)} at {timeFormat(tweet.createdAt)}
              
            </span>
          
          <p className="mt-2 text-gray-500 text-2xl">{tweet.content}</p>
          <div className="flex">
            {/* Like button */}
            <Button className="ml-0" color="blue" title="Like Tweet">
              <svg
                className="w-8 h-8 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </Button>

            {/* Comments */}
            <Button color="blue" title="Show Comments">
              <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
