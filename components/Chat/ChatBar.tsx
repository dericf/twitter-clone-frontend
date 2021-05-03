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

// Schema
import { Message } from "../../schema/Messages";

// Utils
import { WSMessage } from "../../schema/WebSockets";

// Websocket Client Singleton
import WSC from "../../websocket/client";

export const ChatBar = () => {
  // Lib Hooks
  const router = useRouter();

  // Custom Hooks
  const { emitter } = useEmitter();
  const { sendAlert, sendError } = useAlert();
  const { showChatModal, setShowChatModal } = useChat();
  const { user } = useAuth();

  // Local State
  const [newMessageAlert, setNewMessageAlert] = useState(false);

  // Methods
  const handleNewMessageAlert = (data: WSMessage<Message>) => {
    sendAlert(`You have a new message from ${data.body.userFromUsername}`);
    setNewMessageAlert(true);
  };

  // Lifecycle
  useEffect(() => {
    if (user) {
      // Connect to the websocket
      if (!WSC.isAlreadyConnected()) {
        WSC.connect(user.id, emitter);
      }
      // listen for new messages
      emitter.on("messages.new", handleNewMessageAlert);
    }
    return () => {
      // remove the listener.
      emitter.off("messages.new", handleNewMessageAlert);
    };
  }, [user]);

  return (
    <>
      <div className="fixed bottom-10 sm:-bottom-2 right-4 flex justify-end items-center flex-1  sm:mb-0 ">
        {/* Render the modal trigger */}
        <Button
          className=""
          onClick={() => {
            setShowChatModal(!showChatModal);
            setNewMessageAlert(false);
          }}
        >
          Chat
          {newMessageAlert ? <NewMessageAlertSVG /> : <MessageIcon />}
        </Button>
      </div>
      {/* Render the modal here */}
      {showChatModal && <ChatModal />}
    </>
  );
};
