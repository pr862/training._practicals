import { MessageSquare } from "lucide-react-native";
import MessageThread from "./Chat";
import ChatHeader from "./ChatHeader";
import Loading from "./Loading";
import type { User } from "../types/user";
import type { Chat as ChatType } from "../types/chat";
import { Text, View, StyleSheet } from "react-native";
import { colors, textStyles } from "../constants/theme";

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
    activeGroup && !activeGroup.deletedAt && activeGroup.adminId === currentUserProfileId
  );

  const canDeleteGroup = Boolean(
    activeGroup && !activeGroup.deletedAt && activeGroup.adminId === currentUserProfileId
  );

  const isGroupDeleted = Boolean(activeGroup?.deletedAt);

  if (!hasChatRoute || (isGroup && isGroupDeleted)) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.iconWrapper}>
          <MessageSquare size={32} color={colors.accent} />
        </View>
        <Text style={styles.emptyTitle}>Select a conversation</Text>
        <Text style={styles.emptySubtitle}>
          Choose a contact from the list to start messaging.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {activeUser || activeGroup ? (
        <>
          <ChatHeader
            user={activeUser ?? undefined}
            group={activeGroup ?? undefined}
            groupMembers={activeGroupMembers}
            currentUserId={currentUserId}
            onBack={onBack}
            onLeaveGroup={!activeGroupAdminExited ? onLeaveGroup : undefined}
            onDeleteGroup={canDeleteGroup ? onDeleteGroup : undefined}
            onAddMembers={canAddMembers ? onAddMembers : undefined}
            onViewGroupInfo={activeGroup ? onViewGroupInfo : undefined}
          />
          <View style={styles.chatWrapper}>
            {chatId && (
              <MessageThread
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
              <Loading label="Loading messages..." style={styles.absoluteLoading} />
            )}
          </View>
        </>
      ) : (
        <Loading style={styles.fallbackLoading} iconColor="#cbd5e1" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconWrapper: {
    marginBottom: 24,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: colors.text,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyTitle: {
    marginBottom: 8,
    fontSize: 24,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  emptySubtitle: {
    maxWidth: 320,
    ...textStyles.input,
    lineHeight: 20,
    color: "#64748b",
    textAlign: "center",
  },
  chatWrapper: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  absoluteLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
  },
  fallbackLoading: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
