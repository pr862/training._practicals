import { useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase/config";
import { useUsersDirectory } from "../hooks/useUsers";
import Sidebar from "../components/Layout/Sidebar";
import ConfirmationModal from "../components/UI/ConfirmationModal";
import ConversationPane from "../components/UI/ConversationPane";
import CreateGroup from "../components/UI/CreateGroup";
import GroupInfoModal from "../components/UI/GroupInfoModal";
import Loading from "../components/UI/Loading";
import ProfileEditModal from "../components/UI/ProfileEditModal";

type ConfirmAction = "logout" | "leave-group" | "delete-group" | null;

interface ConfirmDialogConfig {
  title: string;
  description: string;
  confirmLabel: string;
  variant?: "danger" | "primary";
  onConfirm: () => void | Promise<void>;
}

export default function Users() {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const navigate = useNavigate();
  const { userId, groupId } = useParams();

  const {
    users,
    loading,
    me,
    otherUsers,
    selectedUser,
    selectedGroupChat,
    selectedGroupChatId,
    groupChats,
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
  } = useUsersDirectory();
  const hasChatRoute = Boolean(userId || groupId);
  const activeUser = hasChatRoute ? selectedUser : null;
  const activeGroup = hasChatRoute ? selectedGroupChat : null;
  const usersById = useMemo(
    () => Object.fromEntries(users.map((user) => [user.uid, user])),
    [users]
  );
  const activeGroupMembers = activeGroup
    ? activeGroup.members.map((memberId) => usersById[memberId]).filter(Boolean)
    : [];
  const activeGroupAdminExited = Boolean(activeGroup?.adminExitedAt);
  const visibleGroupChats = useMemo(
    () => groupChats.filter((chat) => !chat.deletedAt),
    [groupChats]
  );

  const handleProfileImageChange = async (file: File) => {
    try {
      await updateCurrentUserPhoto(file);
    } catch {
      return;
    }
  };

  useEffect(() => {
    if (!userId) return;
    if (!users.length || selectedUser?.uid === userId) return;

    const routeUser = users.find((user) => user.uid === userId);
    if (routeUser) {
      void handleUserClick(routeUser);
    }
  }, [handleUserClick, selectedUser?.uid, userId, users]);

  useEffect(() => {
    if (!groupId) return;
    if (selectedGroupChatId === groupId && chatId === groupId) return;
    handleGroupClick(groupId);
  }, [chatId, groupId, handleGroupClick, selectedGroupChatId]);

  const openChat = (user: typeof otherUsers[number]) => {
    navigate(`/chat/${user.uid}`);
  };

  const openGroupChat = (chat: typeof groupChats[number]) => {
    navigate(`/group/${chat.chatId}`);
  };

  const createGroup = async (groupName: string, memberIds: string[]) => {
    const nextChatId = await handleCreateGroup(groupName, memberIds);
    navigate(`/group/${nextChatId}`);
  };

  const closeChat = () => {
    setIsMessagesLoading(false);
    resetSelection();
    navigate("/", { replace: true });
  };

  const leaveActiveGroup = async () => {
    if (!activeGroup) return;
    const isSoleAdmin = activeGroup.adminId === me?.uid && activeGroup.members.length <= 1;
    await handleLeaveGroup(activeGroup.chatId);
    setConfirmAction(null);
    if (!isSoleAdmin) {
      closeChat();
    }
  };

  const deleteActiveGroup = async () => {
    if (!activeGroup) return;
    await handleDeleteGroup(activeGroup.chatId);
    setConfirmAction(null);
    closeChat();
  };
  

  const removeActiveGroupMember = async (memberId: string) => {
    if (!activeGroup) return;
    await handleRemoveGroupMember(activeGroup.chatId, memberId);
  };

  const handleAddMembersToGroup = async (_groupName: string, memberIds: string[]) => {
    if (!activeGroup) return;
    await handleAddGroupMembers(activeGroup.chatId, memberIds);
    setIsAddMembersModalOpen(false);
  };
  const confirmDialogProps: ConfirmDialogConfig | null = (() => {
    if (confirmAction === "logout") {
      return {
        title: "Logout",
        description: "Are you sure you want to log out?",
        confirmLabel: "Logout",
        onConfirm: () => signOut(auth),
      };
    }

    if (confirmAction === "leave-group") {
      const isSoleAdmin =
        Boolean(activeGroup && activeGroup.adminId === me?.uid && activeGroup.members.length <= 1);
      return {
        title: isSoleAdmin ? "Exit group" : "Leave group",
        description: isSoleAdmin
          ? `Exit "${activeGroup?.groupName || "Group chat"}"? Delete Group will become available after you exit.`
          : `Leave "${activeGroup?.groupName}"?`,
        confirmLabel: isSoleAdmin ? "Exit" : "Leave",
        variant: "primary",
        onConfirm: leaveActiveGroup,
      };
    }

    if (confirmAction === "delete-group") {
      return {
        title: "Delete group",
        description: `This will permanently delete the group and remove it from your chat list.`,
        confirmLabel: "Delete Group",
        variant: "danger",
        onConfirm: deleteActiveGroup,
      };
    }

    return null;
  })();

  if (loading) {
    return <Loading fullScreen label="Loading directory..." />;
  }

  return (
    <div className="relative flex h-dvh overflow-hidden bg-slate-100 font-sans text-slate-900">
      <Sidebar
        currentUser={me}
        otherUsers={otherUsers}
        selectedUser={selectedUser}
        selectedGroupChatId={selectedGroupChatId}
        groupChats={visibleGroupChats}
        chatPreviewsByUserId={chatPreviewsByUserId}
        isChatOpen={hasChatRoute}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onUserClick={openChat}
        onGroupClick={openGroupChat}
        onCreateGroup={createGroup}
        onLogoutClick={() => setConfirmAction("logout")}
        onProfileImageChange={handleProfileImageChange}
        onProfileEdit={() => setIsProfileEditOpen(true)}
      />

      <ConversationPane
        hasChatRoute={hasChatRoute}
        activeUser={activeUser}
        activeGroup={activeGroup}
        activeGroupMembers={activeGroupMembers}
        activeGroupAdminExited={activeGroupAdminExited}
        currentUserId={auth.currentUser?.uid}
        currentUserProfileId={me?.uid}
        chatId={chatId}
        usersById={usersById}
        isChatLoading={isChatLoading}
        isMessagesLoading={isMessagesLoading}
        onMessagesLoadingChange={setIsMessagesLoading}
        onBack={closeChat}
        onLeaveGroup={() => setConfirmAction("leave-group")}
        onDeleteGroup={() => setConfirmAction("delete-group")}
        onAddMembers={() => setIsAddMembersModalOpen(true)}
        onViewGroupInfo={() => setIsGroupInfoOpen(true)}
      />

      {confirmDialogProps && (
        <ConfirmationModal
          open={Boolean(confirmAction)}
          title={confirmDialogProps.title}
          description={confirmDialogProps.description}
          confirmLabel={confirmDialogProps.confirmLabel}
          variant={confirmDialogProps.variant}
          onCancel={() => setConfirmAction(null)}
          onConfirm={confirmDialogProps.onConfirm}
        />
      )}

      {activeGroup && (
        <CreateGroup
          open={isAddMembersModalOpen}
          mode="add"
          users={otherUsers}
          excludedUserIds={activeGroup.members}
          onCancel={() => setIsAddMembersModalOpen(false)}
          onSubmit={handleAddMembersToGroup}
        />
      )}

      {activeGroup && (
        <GroupInfoModal
          open={isGroupInfoOpen}
          group={activeGroup}
          members={activeGroupMembers}
          currentUserId={me?.uid}
          onCancel={() => setIsGroupInfoOpen(false)}
          onRemoveMember={removeActiveGroupMember}
        />
      )}

      <ProfileEditModal
        open={isProfileEditOpen}
        user={me}
        isSubmitting={isProfileImageUploading}
        onCancel={() => setIsProfileEditOpen(false)}
        onSubmit={updateCurrentUserProfile}
      />
    </div>
  );
}
