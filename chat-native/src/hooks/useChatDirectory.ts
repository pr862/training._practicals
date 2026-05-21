import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { formatChatTime, getChatTimeValue } from "../utils/dateUtils";
import type { Chat } from "../types/chat";

interface PrivateChatPreview {
  unreadCount: number;
  lastMessageTime: string;
  lastMessage?: string;
}

export type PrivateChatPreviews = Record<string, PrivateChatPreview>;

interface FirestoreChat {
  chatId?: string;
  type?: "private" | "group";
  members?: unknown;
  groupName: string;
  adminId?: string;
  lastMessage?: string;
  unreadCount?: Record<string, unknown>;
  updatedAt?: Timestamp;
  adminExitedAt?: Timestamp;
  deletedAt?: Timestamp;
  deletedBy?: string;
}

const EMPTY_CHAT_PREVIEWS: PrivateChatPreviews = {};

export function useChatDirectory(currentUserId?: string) {
  const [chatPreviewsByUserId, setChatPreviewsByUserId] = useState<PrivateChatPreviews>({});
  const [groupChats, setGroupChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const chatsQuery = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUserId)
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const nextPreviews: PrivateChatPreviews = {};
      const nextGroupChats: Chat[] = [];

      snapshot.docs.forEach((chatDoc) => {
        const chat = chatDoc.data() as FirestoreChat;
        if (!Array.isArray(chat.members)) return;

        const memberIds = chat.members.filter(
          (memberId): memberId is string => typeof memberId === "string"
        );
        const unreadValue = chat.unreadCount?.[currentUserId];
        const unreadCount = typeof unreadValue === "number" ? unreadValue : 0;
        const chatId = chat.chatId ?? chatDoc.id;
        const normalizedChat: Chat = {
          chatId,
          type: chat.type ?? "private",
          members: memberIds,
          groupName: chat.groupName,
          adminId: chat.adminId,
          lastMessage: chat.lastMessage,
          updatedAt: chat.updatedAt ?? Timestamp.now(),
          adminExitedAt: chat.adminExitedAt,
          deletedAt: chat.deletedAt,
          deletedBy: chat.deletedBy,
          unreadCount: {
            [currentUserId]: unreadCount,
          },
        };

        if (normalizedChat.type === "group") {
          nextGroupChats.push(normalizedChat);
          return;
        }

        const otherUserId = memberIds.find((memberId) => memberId !== currentUserId);
        if (!otherUserId) return;
        nextPreviews[otherUserId] = {
          unreadCount,
          lastMessageTime: formatChatTime(chat.updatedAt ?? Timestamp.now()),
          lastMessage: chat.lastMessage,
        };
      });

      setChatPreviewsByUserId(nextPreviews);
      setGroupChats(nextGroupChats.sort((a, b) => getChatTimeValue(b.updatedAt) - getChatTimeValue(a.updatedAt)));
    });

    return unsubscribe;
  }, [currentUserId]);

  return {
    chatPreviewsByUserId: currentUserId ? chatPreviewsByUserId : EMPTY_CHAT_PREVIEWS,
    groupChats: currentUserId ? groupChats : [],
  };
}
