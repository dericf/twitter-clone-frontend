// React
import React, { useEffect, useState } from "react";

// NextJS
import { useRouter } from "next/router";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";

// UI Components
import { LoadingSpinner } from "../UI/LoadingSpinner";

interface Props {}
export const ConversationList = (props: Props) => {
  // Lib Hooks
  const router = useRouter();

  // Custom Hooks
  const { user } = useAuth();
  const { conversations, setActiveConversation } = useChat();

  // Local State
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && conversations && (
        <div className=" text-white flex flex-col justify-start items-stretch w-full max-w-lg">
          <div className="border border-white flex flex-col flex-1 flex-grow p-6 space-y-2 w-full max-w-xl">
            {/* <p className="text-black">
              {JSON.stringify(conversations)}
            </p> */}
            {Object.keys(conversations).length === 0 && (
              <p className="text-trueGray-900 text-center">No Messages</p>
            )}
            {Object.keys(conversations).map((convoId) => (
              <div
                key={convoId}
                className="flex justify-between p-4 group bg-white text-blueGray-900 hover:text-lightBlue-800 hover:bg-trueGray-200 rounded-sm transition delay-150 shadow-lg hover:shadow-xl cursor-pointer transform hover:animate-pulse"
                onClick={() => {
                  setActiveConversation(conversations[convoId]);
                }}
              >
                <span className="cursor-pointer hover:text-lightBlue-700 uppercase tracking-wide text-sm text-lightBlue-500 font-semibold">
                  {`@${conversations[convoId].username}`}
                </span>

                <span>
                  ({conversations[convoId]?.messages.length} message
                  {conversations[convoId]?.messages.length > 1 && "s"})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
