import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { getOrCreateChat } from "../services/chat";
import { updateUserProfile } from "../services/auth";
import { uploadImageToCloudinary } from "../services/upload";
import { saveUser } from "../services/user";
import { useAuth } from "../context/Auth";
import type { User } from "../types";

interface FirestoreUser {
  uid?: string;
  email?: string;
  name?: string;
  image?: string;
  photoURL?: string;
  createdAt?: unknown;
}

interface ChatPreview {
  unreadCount: number;
  lastMessageTime: string;
}

interface FirestoreChat {
  members?: unknown;
  unreadCount?: Record<string, unknown>;
  updatedAt?: unknown;
}

const normalizeUser = (id: string, data: FirestoreUser): User => ({
  email: data.email ?? "",
  createdAt: data.createdAt,
  uid: data.uid ?? id,
  name: data.name ?? "",
  photoURL: data.photoURL ?? data.image ?? "",
});

const EMPTY_CHAT_PREVIEWS: Record<string, ChatPreview> = {};

const formatChatTime = (updatedAt: unknown) => {
  if (
    updatedAt &&
    typeof updatedAt === "object" &&
    "toDate" in updatedAt &&
    typeof updatedAt.toDate === "function"
  ) {
    return (updatedAt.toDate() as Date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return "";
};

export function useUsersDirectory() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatPreviewsByUserId, setChatPreviewsByUserId] = useState<Record<string, ChatPreview>>({});
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
      const nextPreviews: Record<string, ChatPreview> = {};

      snapshot.docs.forEach((chatDoc) => {
        const chat = chatDoc.data() as FirestoreChat;
        if (!Array.isArray(chat.members)) return;

        const otherUserId = chat.members.find(
          (memberId): memberId is string =>
            typeof memberId === "string" && memberId !== currentUser.uid
        );
        if (!otherUserId) return;

        const unreadValue = chat.unreadCount?.[currentUser.uid];
        nextPreviews[otherUserId] = {
          unreadCount: typeof unreadValue === "number" ? unreadValue : 0,
          lastMessageTime: formatChatTime(chat.updatedAt),
        };
      });

      setChatPreviewsByUserId(nextPreviews);
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

  const selectedUser = useMemo(
    () => users.find((user) => user.uid === selectedUserId) ?? null,
    [selectedUserId, users]
  );

  const handleUserClick = useCallback(async (user: User) => {
    if (!currentUser || user.uid === currentUser.uid) return;

    const requestId = selectionRequestRef.current + 1;
    selectionRequestRef.current = requestId;

    setSelectedUserId(user.uid);
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

  const resetSelection = useCallback(() => {
    selectionRequestRef.current += 1;
    setSelectedUserId(null);
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
    chatPreviewsByUserId: currentUser ? chatPreviewsByUserId : EMPTY_CHAT_PREVIEWS,
    chatId,
    searchQuery,
    setSearchQuery,
    handleUserClick,
    resetSelection,
    isChatLoading,
    isProfileImageUploading,
    updateCurrentUserPhoto,
  };
}
