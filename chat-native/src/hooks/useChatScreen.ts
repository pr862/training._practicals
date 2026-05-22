import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/Auth';
import { useUsersCollection } from './useUsersCollection';
import {
  addGroupMembers,
  deleteGroupChat,
  getOrCreateChat,
  leaveGroupChat,
  removeGroupMember,
} from '../services/chat';

import type { User } from '../types/user';
import type { Chat as ChatType } from '../types/chat';

interface UseChatScreenProps {
  type: 'user' | 'group';
  data: User | ChatType;
  onGoBack: () => void;
}

export const useChatScreen = ({ type, data, onGoBack }: UseChatScreenProps) => {
  const { user: currentUser } = useAuth();
  const { users } = useUsersCollection();

  const [isGroupInfoVisible, setIsGroupInfoVisible] = useState(false);
  const [isAddMembersVisible, setIsAddMembersVisible] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(type === 'user');
  const [chatId, setChatId] = useState<string | null>(
    type === 'group' ? ((data as ChatType).chatId ?? null) : null
  );
  const [activeGroupData, setActiveGroupData] = useState<ChatType | null>(
    type === 'group' ? (data as ChatType) : null
  );

  const isGroupTarget = type === 'group';

  const activeUser: User | null = !isGroupTarget ? (data as User) : null;
  const activeGroup: ChatType | null = isGroupTarget ? activeGroupData : null;

  const usersById = useMemo(
    () => Object.fromEntries(users.map((user) => [user.uid, user])),
    [users]
  );
  const memberNamesById = useMemo(
    () => Object.fromEntries(users.map((user) => [user.uid, user.name || user.email])),
    [users]
  );

  const activeGroupMembers = useMemo(() => {
    if (!activeGroup) return [];
    return activeGroup.members
      .map((memberId) => usersById[memberId])
      .filter((member): member is User => Boolean(member));
  }, [activeGroup, usersById]);

  const currentUserId = currentUser?.uid;
  const currentUserProfileId = currentUser?.uid;
  const activeGroupAdminExited = Boolean(activeGroup?.adminExitedAt);

  const currentUserName =
    usersById[currentUser?.uid ?? '']?.name ||
    usersById[currentUser?.uid ?? '']?.email ||
    currentUser?.displayName ||
    'Someone';

  useEffect(() => {
    let isMounted = true;

    const resolvePrivateChat = async () => {
      if (isGroupTarget) {
        setChatId(activeGroup?.chatId ?? null);
        setIsChatLoading(false);
        return;
      }

      if (!currentUser?.uid || !activeUser?.uid) {
        setChatId(null);
        setIsChatLoading(false);
        return;
      }

      setIsChatLoading(true);
      try {
        const chat = await getOrCreateChat(currentUser.uid, activeUser.uid);
        if (isMounted) {
          setChatId(chat.id);
        }
      } finally {
        if (isMounted) {
          setIsChatLoading(false);
        }
      }
    };

    void resolvePrivateChat();

    return () => {
      isMounted = false;
    };
  }, [activeGroup?.chatId, activeUser?.uid, currentUser?.uid, isGroupTarget]);

  const handleLeaveGroupAction = async () => {
    if (!activeGroup?.chatId || !currentUserId) return;
    await leaveGroupChat(activeGroup.chatId, currentUserId, currentUserName);
    onGoBack();
  };

  const handleDeleteGroupAction = async () => {
    if (!activeGroup?.chatId || !currentUserId) return;
    await deleteGroupChat(activeGroup.chatId, currentUserId);
    onGoBack();
  };

  const handleSubmitAddMembers = async (_groupName: string, memberIds: string[]) => {
    if (!activeGroup?.chatId || !currentUserId) return;
    await addGroupMembers(
      activeGroup.chatId,
      currentUserId,
      memberIds,
      currentUserName,
      memberNamesById
    );
    setActiveGroupData((group) => {
      if (!group) return group;
      return {
        ...group,
        members: Array.from(new Set([...group.members, ...memberIds])),
      };
    });
  };

  const handleRemoveMemberQuery = async (memberId: string) => {
    if (!activeGroup?.chatId || !currentUserId) return;
    await removeGroupMember(activeGroup.chatId, currentUserId, memberId, currentUserName);
    setActiveGroupData((group) => {
      if (!group) return group;
      return {
        ...group,
        members: group.members.filter((id) => id !== memberId),
      };
    });
  };

  return {
    chatId,
    activeUser,
    activeGroup,
    activeGroupMembers,
    activeGroupAdminExited,
    currentUserId,
    currentUserProfileId,
    usersById,
    isChatLoading,
    messagesLoading,
    setMessagesLoading,
    isGroupInfoVisible,
    setIsGroupInfoVisible,
    isAddMembersVisible,
    setIsAddMembersVisible,
    handleLeaveGroupAction,
    handleDeleteGroupAction,
    handleSubmitAddMembers,
    handleRemoveMemberQuery,
    users,
  };
};
