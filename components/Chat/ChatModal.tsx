// React
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

// NextJS
import { useRouter } from "next/router";

// UI Components
import { CloseIcon } from "../UI/Icons/CloseIcon";
import { ModalPortalWrapper } from "../UI/Modals/ModalPortalWrapper";

// App Components
import { ActiveChatView } from "./ActiveChatView";
import { ConversationList } from "./ConversationList";
import { NewChat } from "./NewChat";

// Hooks
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";
import { useEmitter } from "../../hooks/useEmitter";

// CRUD
import { getAllMessages } from "../../crud/messages";

// Utils
import { getConversationUsername } from "./utils";
import { isEmpty } from "../../utilities/objects";

interface Props {}

export const ChatModal = (props: Props) => {
  // Lib Hooks
  const router = useRouter();

  // Custom Hooks
  const { user } = useAuth();
  const { emitter } = useEmitter();
  const { sendAlert, sendError } = useAlert();
  const {
    activeConversation,
    showChatModal,
    setShowChatModal,
    closeModal,
  } = useChat();

  // Methods
  const closeOnEscape = async (e) => {
    // Closes the modal when escape key is pressed
    if (e.key === "Escape") {
      setShowChatModal(false);
    }
  };

  // Lifecycles
  useEffect(() => {
    if (document && showChatModal) {
      // On modal shown
      document?.addEventListener("keydown", closeOnEscape, false);
    }

    return () => {
      if (document)
        document?.removeEventListener("keydown", closeOnEscape, false);
    };
  }, [showChatModal]);

  return (
    <ModalPortalWrapper>
      <div className="fixed bottom-0 left-0 top-0 right-0 px-4 backdrop-blur-md z-30 rounded-sm">
        <div
          className="
      	flex flex-col justify-start items-center
				max-w-2xl max-h-screen 
				mx-auto p-4 sm:p-8
				fixed left-4 md:left-1/4 right-4 md:right-1/4 top-4 bottom-4
				
				bg-white 
				shadow-xl
				backdrop-filter
      "
        >
          <div className="text-center w-full items-start text-2xl relative">
            {/* Modal Title */}
            <h3 className="text-xl">
              {activeConversation
                ? `Conversation with ${getConversationUsername(
                    activeConversation[0],
                    user.id,
                  )}`
                : "Conversations"}
            </h3>
            <CloseIcon handleClick={closeModal} />
          </div>
          {/* Main Modal Body */}
          {activeConversation ? (
            <ActiveChatView />
          ) : (
            <>
              <NewChat />
              <ConversationList />
            </>
          )}
        </div>
      </div>
    </ModalPortalWrapper>
  );
};
