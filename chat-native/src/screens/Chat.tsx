import React from 'react';
import { StyleSheet, StatusBar, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/index';
import ConversationPane from '../components/ConversationPane';
import GroupInfoModal from '../components/GroupInfoModal';
import CreateGroup from '../components/CreateGroup';
import { useChatScreen } from '../hooks/useChatScreen';
import { colors } from '../constants/theme';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { type, data } = route.params;

  const {
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
  } = useChatScreen({
    type,
    data,
    onGoBack: () => navigation.canGoBack() && navigation.goBack(),
  });

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
        onBack={() => navigation.canGoBack() && navigation.goBack()}
        onLeaveGroup={handleLeaveGroupAction}
        onDeleteGroup={handleDeleteGroupAction}
        onAddMembers={() => setIsAddMembersVisible(true)}
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
