// React
import React, { useEffect, useState } from "react";

// NextJS
import { useRouter } from "next/router";

// UI Components
import { Button } from "../UI/Button";
import { MessageIcon } from "../UI/Icons/MessageIcon";

// Other Components
import { ChatModal } from "./ChatModal";
import { NewMessageAlertSVG } from "./NewMessageAlertIcon";

// Hooks
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";
import { useEmitter } from "../../hooks/useEmitter";

export const ChatBar = () => {
  // Lib Hooks
  const router = useRouter();

  // Custom Hooks
  const { emitter } = useEmitter();
  const {
    showChatModal,
    setShowChatModal,
    newChatAlert,
    setNewChatAlert,
  } = useChat();

  return (
    <>
      <div className="flex justify-end items-center flex-1  sm:mb-0 ">
        {/* Render the modal trigger */}
        <Button
          addMargins={false}
          className=""
          onClick={() => {
            setShowChatModal(!showChatModal);
            setNewChatAlert(false);
          }}
        >
          Chat
          {newChatAlert && !showChatModal ? (
            <NewMessageAlertSVG />
          ) : (
            <MessageIcon />
          )}
        </Button>
      </div>
      {/* Render the modal here */}
      {showChatModal && <ChatModal />}
    </>
  );
};
