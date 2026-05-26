import { useMemo, useState } from "react";
import type { Chat } from "../../../packages/data/chat/model";
import type { User } from "../../../packages/data/user/model";

type HomeTab = "chats" | "groups";

interface UseHomeScreenStateProps {
  otherUsers: User[];
  groupChats: Chat[];
  searchQuery: string;
  onLogoutClick: () => void | Promise<void>;
  onProfileEdit: (name: string, imageUri?: string | null, removePhoto?: boolean) => Promise<void>;
  onCreateGroup: (groupName: string, memberIds: string[]) => Promise<void>;
}

export function useHomeScreenState({
  otherUsers,
  groupChats,
  searchQuery,
  onLogoutClick,
  onProfileEdit,
  onCreateGroup,
}: UseHomeScreenStateProps) {
  const [activeTab, setActiveTab] = useState<HomeTab>("chats");
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredUsers = useMemo(() => {
    return otherUsers.filter((user) => {
      if (!normalizedSearchQuery) return true;
      return (
        user.name.toLowerCase().includes(normalizedSearchQuery) ||
        user.email.toLowerCase().includes(normalizedSearchQuery)
      );
    });
  }, [normalizedSearchQuery, otherUsers]);

  const filteredGroups = useMemo(() => {
    return groupChats.filter((group) => {
      if (!group) return false;
      if (group.deletedAt) return false;
      if (!normalizedSearchQuery) return true;

      const nameToSearch = group.groupName || group.name || "Group chat";
      return nameToSearch.toLowerCase().includes(normalizedSearchQuery);
    });
  }, [groupChats, normalizedSearchQuery]);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogoutClick();
      setLogoutConfirmOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSubmitProfileEdit = async (
    name: string,
    imageUri?: string | null,
    removePhoto?: boolean
  ) => {
    await onProfileEdit(name, imageUri, removePhoto);
    setProfileEditOpen(false);
  };

  const handleCreateGroup = async (groupName: string, memberIds: string[]) => {
    await onCreateGroup(groupName, memberIds);
    setCreateGroupOpen(false);
  };

  return {
    activeTab,
    setActiveTab,
    profileEditOpen,
    setProfileEditOpen,
    createGroupOpen,
    setCreateGroupOpen,
    logoutConfirmOpen,
    setLogoutConfirmOpen,
    isLoggingOut,
    filteredUsers,
    filteredGroups,
    handleConfirmLogout,
    handleSubmitProfileEdit,
    handleCreateGroup,
  };
}
