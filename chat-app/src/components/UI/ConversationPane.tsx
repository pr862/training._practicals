import { MessageSquare } from "lucide-react";
import Chat from "./Chat";
import ChatHeader from "./ChatHeader";
import Loading from "./Loading";
import type { Chat as ChatType, User } from "../../types";

interface ConversationPaneProps {
  hasChatRoute: boolean;
  activeUser: User | null;
  activeGroup: ChatType | null;
  activeGroupMembers: User[];
  activeGroupAdminExited: boolean;
  currentUserId?: string;
  currentUserProfileId?: string;
  chatId: string | null;
  usersById: Record<string, User>;
  isChatLoading: boolean;
  isMessagesLoading: boolean;
  onMessagesLoadingChange: (loading: boolean) => void;
  onBack: () => void;
  onLeaveGroup: () => void;
  onDeleteGroup: () => void;
  onAddMembers: () => void;
  onViewGroupInfo: () => void;
}

const getGroupReadOnlyMessage = (group: ChatType | null, adminExited: boolean) => {
  if (group?.deletedAt) {
    return "This group was deleted. Messages are read-only.";
  }

  if (adminExited) {
    return "You can't send messages to this because you're no longer a member";
  }

  return "";
};

export default function ConversationPane({
  hasChatRoute,
  activeUser,
  activeGroup,
  activeGroupMembers,
  activeGroupAdminExited,
  currentUserId,
  currentUserProfileId,
  chatId,
  usersById,
  isChatLoading,
  isMessagesLoading,
  onMessagesLoadingChange,
  onBack,
  onLeaveGroup,
  onDeleteGroup,
  onAddMembers,
  onViewGroupInfo,
}: ConversationPaneProps) {
  const isGroup = Boolean(activeGroup);
  const canAddMembers = Boolean(
    activeGroup &&
    !activeGroup.deletedAt &&
    activeGroup.adminId === currentUserProfileId
  );

  return (
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
            currentUserId={currentUserId}
            onBack={onBack}
            onLeaveGroup={!activeGroupAdminExited ? onLeaveGroup : undefined}
            onDeleteGroup={activeGroupAdminExited ? onDeleteGroup : undefined}
            onAddMembers={canAddMembers ? onAddMembers : undefined}
            onViewGroupInfo={activeGroup ? onViewGroupInfo : undefined}
          />
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {chatId && (
              <Chat
                key={chatId}
                chatId={chatId}
                user={activeUser ?? undefined}
                title={activeGroup?.groupName}
                isGroup={isGroup}
                usersById={usersById}
                readOnlyMessage={getGroupReadOnlyMessage(activeGroup, activeGroupAdminExited)}
                onLoadingChange={onMessagesLoadingChange}
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
  );
}
