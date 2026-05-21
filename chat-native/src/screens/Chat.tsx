import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, StatusBar, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/index';
import ConversationPane from '../components/ConversationPane';
import GroupInfoModal from '../components/GroupInfoModal';
import CreateGroup from '../components/CreateGroup';
import { useAuth } from '../context/Auth';
import { useUsersCollection } from '../hooks/useUsersCollection';
import {
  addGroupMembers,
  deleteGroupChat,
  getOrCreateChat,
  leaveGroupChat,
  removeGroupMember,
} from '../services/chat';

import type { User } from '../types/user';
import type { Chat as ChatType } from '../types/chat';
import { colors } from '../constants/theme';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { type, data } = route.params;
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

  const handleBackNavigation = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleLeaveGroupAction = async () => {
    if (!activeGroup?.chatId || !currentUserId) return;
    await leaveGroupChat(activeGroup.chatId, currentUserId, currentUserName);
    navigation.goBack();
  };

  const handleDeleteGroupAction = async () => {
    if (!activeGroup?.chatId || !currentUserId) return;
    await deleteGroupChat(activeGroup.chatId, currentUserId);
    navigation.goBack();
  };

  const handleAddMembersAction = () => {
    setIsAddMembersVisible(true);
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

  return (
    <SafeAreaView style={styles.screenSafeArea}>
      <StatusBar translucent={false} barStyle="light-content" backgroundColor={colors.background} />

      <ConversationPane
        hasChatRoute={true}
        activeUser={activeUser}
        activeGroup={activeGroup}
        activeGroupMembers={activeGroupMembers}
        activeGroupAdminExited={activeGroupAdminExited}
        currentUserId={currentUserId}
        currentUserProfileId={currentUserProfileId}
        chatId={chatId}
        usersById={usersById}
        isChatLoading={isChatLoading}
        isMessagesLoading={messagesLoading}
        onMessagesLoadingChange={setMessagesLoading}
        onBack={handleBackNavigation}
        onLeaveGroup={handleLeaveGroupAction}
        onDeleteGroup={handleDeleteGroupAction}
        onAddMembers={handleAddMembersAction}
        onViewGroupInfo={() => setIsGroupInfoVisible(true)}
      />

      {activeGroup && (
        <>
          <GroupInfoModal
            open={isGroupInfoVisible}
            group={activeGroup}
            members={activeGroupMembers}
            currentUserId={currentUserId}
            onCancel={() => setIsGroupInfoVisible(false)}
            onRemoveMember={handleRemoveMemberQuery}
          />
          <CreateGroup
            open={isAddMembersVisible}
            mode="add"
            users={users}
            excludedUserIds={activeGroup.members}
            onCancel={() => setIsAddMembersVisible(false)}
            onSubmit={handleSubmitAddMembers}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenSafeArea: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
});

export default ChatScreen;
