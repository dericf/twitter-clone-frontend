// React
import React, { FunctionComponent, useState } from "react";

// Hooks
import { useChat } from "../../hooks/useChat";

// UI Components
import { Button } from "../UI/Button";

// App Components
import { NewChatSearch } from "./NewChatSearch";

interface Props {}
export const NewChat: FunctionComponent<Props> = (props) => {
  const { delegateCreateMessage, setSelectedUser, selectedUser } = useChat();

  const [showUserSearch, setShowUserSearch] = useState(false);
  const [messageText, setMessageText] = useState("");

  const sendMessage = async () => {
    // Call the delegate function to actually send the message
    setMessageText("");
    await delegateCreateMessage(messageText, selectedUser.id);
    setSelectedUser(null);
    // Reset the form
  };

  const handleCancel = () => {
    // Reset the form and hide search
    setShowUserSearch(false);
    setSelectedUser(null);
    setMessageText("");
  };

  return (
    <div className="self-start my-4 w-full">
      {showUserSearch ? (
        <Button onClick={handleCancel} addMargins={false}>
          Cancel
        </Button>
      ) : (
        <>
          <Button onClick={() => setShowUserSearch(true)} addMargins={false}>
            New Message
          </Button>
        </>
      )}
      {showUserSearch && <NewChatSearch />}

      {selectedUser && (
        <div className="flex justify-center items-stretch w-full">
          <textarea
            name="messageText"
            id=""
            className="w-full h-full px-4 py-2"
            value={messageText}
            onChange={(e) => setMessageText(e.currentTarget.value)}
          ></textarea>
          <button
            className="w-max px-4 bg-green-600 text-white"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};
