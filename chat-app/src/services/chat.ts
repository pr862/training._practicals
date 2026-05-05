import { db } from "../firebase/config";
import {
  doc,
  FieldPath,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";

export const getPrivateChatId = (currentUserId: string, selectedUserId: string) => {
  const [firstUserId, secondUserId] = [currentUserId, selectedUserId].sort();
  return `private_${firstUserId}_${secondUserId}`;
};

export const getOrCreateChat = async (
  currentUserId: string,
  selectedUserId: string
) => {
  const chatId = getPrivateChatId(currentUserId, selectedUserId);
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (chatSnap.exists()) {
    await updateDoc(chatRef, new FieldPath("unreadCount", currentUserId), 0);
    return { id: chatId, ...chatSnap.data() };
  }

  const initialChatData = {
    chatId,
    type: "private",
    members: [currentUserId, selectedUserId],
    lastMessage: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    unreadCount: {
      [currentUserId]: 0,
      [selectedUserId]: 0,
    },
  };

  await setDoc(chatRef, initialChatData);
  return { id: chatId, ...initialChatData };
};

export const updateLastMessage = async (chatId: string, messageText: string) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: messageText,
    updatedAt: serverTimestamp(),
  });
};
