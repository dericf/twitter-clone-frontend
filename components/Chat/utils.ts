// Schema
import { Conversations, Message } from "../../schema/Messages";

export const getConversationUsername = (
  message: Message,
  currentUserId: number,
): string => {
  /**
   * Return the username of the user the currentUser is chatting with
   */
  if (!message) return ""; // shouldn't be needed - was to fix a weird bug
  return message.userToId === currentUserId
    ? message.userFromUsername
    : message.userToUsername;
};

export const getConversationUserId = (
  message: Message,
  currentUserId: number,
): number => {
  /**
   * Return the userId of the user the currentUser is chatting with
   * The userId is used to represent the <conversationId>
   */
  if (!message) return null; // shouldn't be needed - was to fix a weird bug
  return message.userToId === currentUserId
    ? message.userFromId
    : message.userToId;
};

export const groupMessagesByConversation = (
  currentUserId: number,
  messages: Message[],
): Conversations => {
  /**
   * Take a raw array of messages and restructure to look like a Conversation
   */
  // console.log("Before: ", messages);
  // Loop through array and build the convos object
  let convos = {} as Conversations;
  for (let messageIndex = 0; messageIndex < messages.length; messageIndex++) {
    const message = messages[messageIndex];
    const conversationId = getConversationUserId(message, currentUserId);
    if (!(conversationId in convos)) {
      // First message for this conversation
      convos[conversationId] = {
        userId: conversationId,
        username: getConversationUsername(message, currentUserId),
        messages: [message],
      };
    } else {
      // Append message to the conversation
      convos[conversationId].messages = [
        ...convos[conversationId].messages,
        message,
      ];
    }
    // console.log("During: ", convos);
  }
  // console.log("After: ", convos);
  return convos;
};
