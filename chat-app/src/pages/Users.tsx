import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { MessageSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase/config";
import { useUsersDirectory } from "../hooks/useUsers";
import Chat from "../components/UI/Chat";
import Sidebar from "../components/Layout/Sidebar";
import ChatHeader from "../components/UI/ChatHeader";
import ConfirmationModal from "../components/UI/ConfirmationModal";
import CreateGroup from "../components/UI/CreateGroup";
import Loading from "../components/UI/Loading";
import { addGroupMembers } from "../services/chat";

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
    handleLeaveGroup,
    handleDeleteGroup,
    resetSelection,
    isChatLoading,
    isProfileImageUploading,
    updateCurrentUserPhoto,
  } = useUsersDirectory();
  const hasChatRoute = Boolean(userId || groupId);
  const activeUser = hasChatRoute ? selectedUser : null;
  const activeGroup = hasChatRoute ? selectedGroupChat : null;
  const usersById = Object.fromEntries(users.map((user) => [user.uid, user]));
  const activeGroupMembers = activeGroup
    ? activeGroup.members.map((memberId) => usersById[memberId]).filter(Boolean)
    : [];

  const handleProfileImageChange = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return;
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
    await handleLeaveGroup(activeGroup.chatId);
    setConfirmAction(null);
    closeChat();
  };

  const deleteActiveGroup = async () => {
    if (!activeGroup) return;
    await handleDeleteGroup(activeGroup.chatId);
    setConfirmAction(null);
  };

  const handleAddMembersToGroup = async (groupName: string, memberIds: string[]) => {
    if (!activeGroup || !me) return;
    try {
      await addGroupMembers(
        activeGroup.chatId,
        me.uid,
        memberIds,
        me.name || me.email,
        Object.fromEntries(users.map(u => [u.uid, u.name || u.email]))
      );
      setIsAddMembersModalOpen(false);
    } catch (error) {
      console.error("Failed to add members:", error);
    }
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
      return {
        title: "Leave group",
        description: `Leave "${activeGroup?.groupName || "Group chat"}"? You will no longer receive messages from this group.`,
        confirmLabel: "Leave",
        variant: "primary",
        onConfirm: leaveActiveGroup,
      };
    }

    if (confirmAction === "delete-group") {
      return {
        title: "Delete group",
        description: `Delete "${activeGroup?.groupName || "Group chat"}" for all members? The chat will become read-only.`,
        confirmLabel: "Delete",
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
        me={me}
        otherUsers={otherUsers}
        selectedUser={selectedUser}
        selectedGroupChatId={selectedGroupChatId}
        groupChats={groupChats}
        chatPreviewsByUserId={chatPreviewsByUserId}
        isChatOpen={hasChatRoute}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onUserClick={openChat}
        onGroupClick={openGroupChat}
        onCreateGroup={createGroup}
        onLogoutClick={() => setConfirmAction("logout")}
        onProfileImageChange={handleProfileImageChange}
        isProfileImageUploading={isProfileImageUploading}
      />

      <main className={`${hasChatRoute ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col overflow-hidden bg-white`}>
        {!hasChatRoute ? (
          <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <MessageSquare size={32} className="text-blue-900" />
            </div>
            <h2 className="mb-2 text-2xl font-black tracking-tight text-slate-950">
              Select a conversation
            </h2>
            <p className="max-w-[320px] text-sm leading-relaxed text-slate-500">
              Choose a contact from the list to start messaging.
            </p>
          </div>
        ) : activeUser || activeGroup ? (
          <>
            <ChatHeader
              user={activeUser ?? undefined}
              group={activeGroup ?? undefined}
              groupMembers={activeGroupMembers}
              currentUserId={auth.currentUser?.uid}
              onBack={closeChat}
              onLeaveGroup={activeGroup && !activeGroup.deletedAt ? () => setConfirmAction("leave-group") : undefined}
              onDeleteGroup={activeGroup && !activeGroup.deletedAt ? () => setConfirmAction("delete-group") : undefined}
              onAddMembers={activeGroup && !activeGroup.deletedAt && activeGroup.adminId === me?.uid ? () => setIsAddMembersModalOpen(true) : undefined}
            />
            <div className="relative min-h-0 flex-1 overflow-hidden">
              {chatId && (
                <Chat
                  key={chatId}
                  chatId={chatId}
                  user={activeUser ?? undefined}
                  title={activeGroup?.groupName}
                  isGroup={Boolean(activeGroup)}
                  usersById={usersById}
                  readOnlyMessage={activeGroup?.deletedAt ? "This group was deleted. Messages are read-only." : ""}
                  onLoadingChange={setIsMessagesLoading}
                />
              )}
              {(!chatId || isChatLoading || isMessagesLoading) && (
                <Loading 
                  label="Loading messages..." 
                  className="absolute inset-0 bg-white" 
                  iconClassName="text-slate-300" 
                />
              )}
            </div>
          </>
        ) : (
          <Loading className="bg-white" iconClassName="text-slate-300" />
        )}
      </main>

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
    </div>
  );
}
