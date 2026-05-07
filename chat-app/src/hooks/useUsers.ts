import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import {addGroupMembers, createGroupChat, deleteGroupChat, getOrCreateChat, leaveGroupChat} from "../services/chat";
import { updateUserProfile } from "../services/auth";
import { uploadImageToCloudinary } from "../services/upload";
import { saveUser } from "../services/user";
import { useAuth } from "../context/Auth";
import { formatChatTime, getChatTimeValue } from "../utils/chat";
import type { Chat, User } from "../types";

interface FirestoreUser {
  uid?: string;
  email?: string;
  name?: string;
  image?: string;
  photoURL?: string;
  createdAt?: unknown;
}

interface PrivateChatPreview {
  unreadCount: number;
  lastMessageTime: string;
  lastMessage?: string;
}

type PrivateChatPreviews = Record<string, PrivateChatPreview>;

interface FirestoreChat {
  chatId?: string;
  type?: "private" | "group";
  members?: unknown;
  groupName?: string;
  adminId?: string;
  lastMessage?: string;
  unreadCount?: Record<string, unknown>;
  updatedAt?: unknown;
  deletedAt?: unknown;
  deletedBy?: string;
}

const normalizeUser = (id: string, data: FirestoreUser): User => ({
  email: data.email ?? "",
  createdAt: data.createdAt,
  uid: data.uid ?? id,
  name: data.name ?? "",
  photoURL: data.photoURL ?? data.image ?? "",
});

const EMPTY_CHAT_PREVIEWS: PrivateChatPreviews = {};

export function useUsersDirectory() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedGroupChatId, setSelectedGroupChatId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatPreviewsByUserId, setChatPreviewsByUserId] = useState<PrivateChatPreviews>({});
  const [groupChats, setGroupChats] = useState<Chat[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isProfileImageUploading, setIsProfileImageUploading] = useState(false);
  const selectionRequestRef = useRef(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const nextUsers = snapshot.docs.map((doc) =>
        normalizeUser(doc.id, doc.data() as FirestoreUser)
      );

      setUsers(nextUsers);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    const chatsQuery = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUser.uid)
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
        const unreadValue = chat.unreadCount?.[currentUser.uid];
        const unreadCount = typeof unreadValue === "number" ? unreadValue : 0;
        const chatId = chat.chatId ?? chatDoc.id;
        const normalizedChat: Chat = {
          chatId,
          type: chat.type ?? "private",
          members: memberIds,
          groupName: chat.groupName,
          adminId: chat.adminId,
          lastMessage: chat.lastMessage,
          updatedAt: chat.updatedAt,
          deletedAt: chat.deletedAt,
          deletedBy: chat.deletedBy,
          unreadCount: {
            [currentUser.uid]: unreadCount,
          },
        };

        if (normalizedChat.type === "group") {
          nextGroupChats.push(normalizedChat);
          return;
        }

        const otherUserId = memberIds.find((memberId) => memberId !== currentUser.uid);
        if (!otherUserId) return;
        nextPreviews[otherUserId] = {
          unreadCount,
          lastMessageTime: formatChatTime(chat.updatedAt),
          lastMessage: chat.lastMessage,
        };
      });

      setChatPreviewsByUserId(nextPreviews);
      setGroupChats(nextGroupChats.sort((a, b) => getChatTimeValue(b.updatedAt) - getChatTimeValue(a.updatedAt)));
    });

    return unsubscribe;
  }, [currentUser?.uid]);

  const filteredUsers = useMemo(() => {
    const searchTerm = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      if (!searchTerm) return true;

      return (
        user.email.toLowerCase().includes(searchTerm) ||
        user.name.toLowerCase().includes(searchTerm)
      );
    });
  }, [searchQuery, users]);

  const me = useMemo(
    () => filteredUsers.find((user) => user.uid === currentUser?.uid),
    [currentUser?.uid, filteredUsers]
  );

  const otherUsers = useMemo(
    () => filteredUsers.filter((user) => user.uid !== currentUser?.uid),
    [currentUser?.uid, filteredUsers]
  );

  const filteredGroupChats = useMemo(() => {
    const searchTerm = searchQuery.trim().toLowerCase();
    if (!searchTerm) return groupChats;

    return groupChats.filter((chat) =>
      (chat.groupName ?? "Group chat").toLowerCase().includes(searchTerm)
    );
  }, [groupChats, searchQuery]);

  const selectedUser = useMemo(
    () => users.find((user) => user.uid === selectedUserId) ?? null,
    [selectedUserId, users]
  );

  const selectedGroupChat = useMemo(
    () => groupChats.find((chat) => chat.chatId === selectedGroupChatId) ?? null,
    [groupChats, selectedGroupChatId]
  );

  const handleUserClick = useCallback(async (user: User) => {
    if (!currentUser || user.uid === currentUser.uid) return;

    const requestId = selectionRequestRef.current + 1;
    selectionRequestRef.current = requestId;

    setSelectedUserId(user.uid);
    setSelectedGroupChatId(null);
    setChatId(null);
    setIsChatLoading(true);

    try {
      const chat = await getOrCreateChat(currentUser.uid, user.uid);
      if (selectionRequestRef.current !== requestId) return;
      setChatId(chat.id);
    } finally {
      if (selectionRequestRef.current === requestId) {
        setIsChatLoading(false);
      }
    }
  }, [currentUser]);

  const handleGroupClick = useCallback((nextChatId: string) => {
    selectionRequestRef.current += 1;
    setSelectedUserId(null);
    setSelectedGroupChatId(nextChatId);
    setChatId(nextChatId);
    setIsChatLoading(false);
  }, []);

  const handleCreateGroup = useCallback(async (groupName: string, memberIds: string[]) => {
    if (!currentUser) {
      throw new Error("Session expired.");
    }

    const currentUserName = me?.name || me?.email || currentUser.displayName || "Someone";
    const memberNamesById = Object.fromEntries(
      users.map((user) => [user.uid, user.name || user.email])
    );

    setIsChatLoading(true);
    try {
      const chat = await createGroupChat(
        currentUser.uid,
        memberIds,
        groupName,
        currentUserName,
        memberNamesById
      );
      setSelectedUserId(null);
      setSelectedGroupChatId(chat.id);
      setChatId(chat.id);
      return chat.id;
    } finally {
      setIsChatLoading(false);
    }
  }, [currentUser, me?.email, me?.name, users]);

  const handleAddGroupMembers = useCallback(async (nextChatId: string, memberIds: string[]) => {
    if (!currentUser) {
      throw new Error("Session expired.");
    }

    const currentUserName = me?.name || me?.email || currentUser.displayName || "Someone";
    const memberNamesById = Object.fromEntries(
      users.map((user) => [user.uid, user.name || user.email])
    );

    await addGroupMembers(
      nextChatId,
      currentUser.uid,
      memberIds,
      currentUserName,
      memberNamesById
    );
  }, [currentUser, me?.email, me?.name, users]);

  const handleLeaveGroup = useCallback(async (nextChatId: string) => {
    if (!currentUser) return;
    const currentUserName = me?.name || me?.email || currentUser.displayName || "Someone";
    await leaveGroupChat(nextChatId, currentUser.uid, currentUserName);
  }, [currentUser, me?.email, me?.name]);

  const handleDeleteGroup = useCallback(async (nextChatId: string) => {
    if (!currentUser) return;
    const currentUserName = me?.name || me?.email || currentUser.displayName || "Someone";
    await deleteGroupChat(nextChatId, currentUser.uid, currentUserName);
  }, [currentUser, me?.email, me?.name]);

  const resetSelection = useCallback(() => {
    selectionRequestRef.current += 1;
    setSelectedUserId(null);
    setSelectedGroupChatId(null);
    setChatId(null);
    setIsChatLoading(false);
  }, []);

  const updateCurrentUserPhoto = async (file: File) => {
    if (!currentUser) return;

    setIsProfileImageUploading(true);

    try {
      const photoURL = await uploadImageToCloudinary(file);
      const displayName = currentUser.displayName ?? me?.name ?? "";
      const email = currentUser.email ?? me?.email ?? "";

      await updateUserProfile(currentUser, {
        ...(displayName ? { displayName } : {}),
        photoURL,
      });

      await saveUser(currentUser.uid, email, displayName, photoURL);
    } finally {
      setIsProfileImageUploading(false);
    }
  };

  return {
    users,
    loading,
    me,
    otherUsers,
    selectedUser,
    selectedGroupChat,
    selectedGroupChatId,
    groupChats: filteredGroupChats,
    chatPreviewsByUserId: currentUser ? chatPreviewsByUserId : EMPTY_CHAT_PREVIEWS,
    chatId,
    searchQuery,
    setSearchQuery,
    handleUserClick,
    handleGroupClick,
    handleCreateGroup,
    handleAddGroupMembers,
    handleLeaveGroup,
    handleDeleteGroup,
    resetSelection,
    isChatLoading,
    isProfileImageUploading,
    updateCurrentUserPhoto,
  };
}
