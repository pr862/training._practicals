import { useCallback, useMemo, useRef, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { addGroupMembers, createGroupChat, deleteGroupChat, getOrCreateChat, leaveGroupChat, removeGroupMember } from "../services/chat";
import { useAuth } from "../context/Auth";
import { useChatDirectory } from "./useChatDirectory";
import { useCurrentUserProfile } from "./useCurrentUserProfile";
import { useUsersCollection } from "./useUsersCollection";
import type { User } from "../types";

function getDisplayName(currentUser: FirebaseUser | null, me?: User) {
  return me?.name || me?.email || currentUser?.displayName || "Someone";
}

function getMemberNamesById(users: User[]) {
  return Object.fromEntries(users.map((user) => [user.uid, user.name || user.email]));
}

export function useUsersDirectory() {
  const { currentUser } = useAuth();
  const { users, loading } = useUsersCollection();
  const { chatPreviewsByUserId, groupChats } = useChatDirectory(currentUser?.uid);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedGroupChatId, setSelectedGroupChatId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const selectionRequestRef = useRef(0);

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
    () => users.find((user) => user.uid === currentUser?.uid),
    [currentUser?.uid, users]
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
  const memberNamesById = useMemo(() => getMemberNamesById(users), [users]);
  const currentUserName = useMemo(
    () => getDisplayName(currentUser, me),
    [currentUser, me]
  );
  const {
    isProfileImageUploading,
    updateCurrentUserPhoto,
    updateCurrentUserProfile,
  } = useCurrentUserProfile(currentUser, me);

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
  }, [currentUser, currentUserName, memberNamesById]);

  const handleAddGroupMembers = useCallback(async (nextChatId: string, memberIds: string[]) => {
    if (!currentUser) {
      throw new Error("Session expired.");
    }

    await addGroupMembers(
      nextChatId,
      currentUser.uid,
      memberIds,
      currentUserName,
      memberNamesById
    );
  }, [currentUser, currentUserName, memberNamesById]);

  const handleLeaveGroup = useCallback(async (nextChatId: string) => {
    if (!currentUser) return;
    await leaveGroupChat(nextChatId, currentUser.uid, currentUserName);
  }, [currentUser, currentUserName]);

  const handleDeleteGroup = useCallback(async (nextChatId: string) => {
    if (!currentUser) return;
    await deleteGroupChat(nextChatId, currentUser.uid, currentUserName);
  }, [currentUser, currentUserName]);

  const handleRemoveGroupMember = useCallback(async (nextChatId: string, memberId: string) => {
    if (!currentUser) return;
    const member = users.find((user) => user.uid === memberId);
    const memberName = member?.name || member?.email || "A member";
    await removeGroupMember(nextChatId, currentUser.uid, memberId, currentUserName, memberName);
  }, [currentUser, currentUserName, users]);

  const resetSelection = useCallback(() => {
    selectionRequestRef.current += 1;
    setSelectedUserId(null);
    setSelectedGroupChatId(null);
    setChatId(null);
    setIsChatLoading(false);
  }, []);

  return {
    users,
    loading,
    me,
    otherUsers,
    selectedUser,
    selectedGroupChat,
    selectedGroupChatId,
    groupChats: filteredGroupChats,
    chatPreviewsByUserId,
    chatId,
    searchQuery,
    setSearchQuery,
    handleUserClick,
    handleGroupClick,
    handleCreateGroup,
    handleAddGroupMembers,
    handleLeaveGroup,
    handleDeleteGroup,
    handleRemoveGroupMember,
    resetSelection,
    isChatLoading,
    isProfileImageUploading,
    updateCurrentUserPhoto,
    updateCurrentUserProfile,
  };
}
