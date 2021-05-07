import { useChat } from "../../hooks/useChat";

export const BackToConversationsButton = () => {
  const { goBack } = useChat();

  return (
    <div className="flex justify-start self-start items-center w-full max-h-full px-2 text-trueGray-900 hover:text-lightBlue-800 cursor-pointer mb-2 text-sm">
      <span className="flex" onClick={() => goBack()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Conversations
      </span>
    </div>
  );
};
