import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, FlatList, StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Camera, LogOut, MessageSquare, Plus, Search, Users } from "lucide-react-native";
import { User } from "../../../packages/data/user/model";
import { Chat } from "../../../packages/data/chat/model";
import { RootStackParamList } from "../../app/index";
import { logoutUser } from "../../../packages/data/auth/service";
import ProfileEditModal from "./components/ProfileEditModal";
import CreateGroup from "./components/CreateGroup";
import UserAvatar from "../../../packages/style/components/UserAvatar";
import UserCard from "./components/UserCard";
import ConfirmationModal from "../../../packages/style/components/ConfirmationModal";
import Loading from "../../../packages/style/components/Loading";
import { colors, textStyles } from "../../../packages/style/theme";
import { useAuth } from "../../app/context/Auth";
import { useHomeScreenState } from "./useHomeScreenState";
import { useUsersDirectory } from "./useUsers";


type HomeNavigation = NativeStackNavigationProp<RootStackParamList, "Home">;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigation>();
  const { user } = useAuth();
  const {
    otherUsers,
    loading: usersLoading,
    me,
    groupChats,
    chatPreviewsByUserId,
    searchQuery,
    setSearchQuery,
    handleCreateGroup: createGroup,
    isProfileImageUploading,
    updateCurrentUserProfile,
  } = useUsersDirectory();

  const currentUser = user ? {
    id: user.uid,
    uid: user.uid,
    email: me?.email || user.email || "",
    name: me?.name || user.displayName || "",
    photoURL: me?.photoURL || user.photoURL || "",
    createdAt: me?.createdAt,
  } : undefined;
  const isHydrating = !currentUser || usersLoading;

  const {
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
  } = useHomeScreenState({
    otherUsers,
    groupChats,
    searchQuery,
    onLogoutClick: logoutUser,
    onProfileEdit: async (name, imageUri, removePhoto) => {
      await updateCurrentUserProfile(name, imageUri ?? null, removePhoto);
    },
    onCreateGroup: createGroup,
  });

  const handleUserSelection = (targetUser: User) => {
    navigation.navigate("Chat", { type: "user", data: targetUser });
  };

  const handleGroupSelection = (targetGroup: Chat) => {
    navigation.navigate("Chat", { type: "group", data: targetGroup });
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const preview = chatPreviewsByUserId[item.uid];
    return (
      <UserCard
        user={item}
        onClick={() => handleUserSelection(item)}
        unreadCount={preview?.unreadCount}
        lastMessageTime={preview?.lastMessageTime}
      />
    );
  };

  const renderGroupItem = ({ item }: { item: Chat }) => {
    return (
      <UserCard
        title={item.groupName || "Unnamed Group"}
        subtitle={item.lastMessage || `${item.members.length} members`}
        onClick={() => handleGroupSelection(item)}
        avatar={
          <View style={styles.groupAvatarWrapper}>
            <Users size={24} color={colors.accent} />
          </View>
        }
      />
    );
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>
        {activeTab === "chats" ? "RECENT ACTIVITY" : "YOUR COMMUNITIES"}
      </Text>
      {activeTab === "groups" && (
        <TouchableOpacity onPress={() => setCreateGroupOpen(true)} style={styles.createGroupBtn}>
          <Plus size={14} color={colors.accent} />
          <Text style={styles.createGroupText}>Create Group</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyState}>
      <Users size={40} color={colors.textMuted} />
      <Text style={styles.emptyText}>
        {activeTab === "chats" ? "No users found" : "No groups found"}
      </Text>
    </View>
  );

  if (isHydrating) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <Loading fullScreen />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />


      <ConfirmationModal
        open={logoutConfirmOpen}
        title="See You Soon!"
        description="Are you sure you want to log out ?"
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        variant="danger"
        onCancel={() => !isLoggingOut && setLogoutConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
      />

      <ProfileEditModal
        open={profileEditOpen}
        user={currentUser}
        onCancel={() => setProfileEditOpen(false)}
        onSubmit={handleSubmitProfileEdit}
        isSubmitting={isProfileImageUploading}
      />
      <CreateGroup
        open={createGroupOpen}
        mode="create"
        users={otherUsers}
        onCancel={() => setCreateGroupOpen(false)}
        onSubmit={handleCreateGroup}
      />

      {currentUser && (
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <TouchableOpacity onPress={() => setProfileEditOpen(true)} style={styles.avatarWrapper}>
              <UserAvatar user={currentUser} size="lg" />
              <View style={styles.cameraBadge}>
                {isProfileImageUploading ? (
                  <Loading size="small" iconColor={colors.accentText} style={styles.cameraBadgeLoading} />
                ) : (
                  <Camera size={10} color={colors.accentText} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.userInfo} onPress={() => setProfileEditOpen(true)}>
              <Text style={styles.userName} numberOfLines={1}>{currentUser.name}</Text>
              <Text style={styles.userEmail} numberOfLines={1}>{currentUser.email}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setLogoutConfirmOpen(true)}
              style={styles.logoutBtn}
            >
              <LogOut size={18} color={colors.accentText} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.actionArea}>
        <View style={styles.searchContainer}>
          <Search size={16} color="#76767a" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#76767a"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("chats")}
            style={[styles.tabButton, activeTab === "chats" && styles.tabActive]}
          >
            <MessageSquare size={14} color={activeTab === "chats" ? colors.accentText : colors.textMuted} />
            <Text style={[styles.tabText, activeTab === "chats" && styles.tabTextActive]}>CHATS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("groups")}
            style={[styles.tabButton, activeTab === "groups" && styles.tabActive]}
          >
            <Users size={14} color={activeTab === "groups" ? colors.accentText : colors.textMuted} />
            <Text style={[styles.tabText, activeTab === "groups" && styles.tabTextActive]}>GROUPS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={(activeTab === "chats" ? filteredUsers : filteredGroups) as any[]}
        renderItem={(activeTab === "chats" ? renderUserItem : renderGroupItem) as any}
        keyExtractor={(item: any, index) => {
          if (activeTab === "chats") {
            return item.uid || item.id || `user-${index}`;
          }
          return item.chatId || item.id || item.groupName || `group-${index}`;
        }}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContainerStyle}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  profileSection: {
    padding: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatarWrapper: {
    position: "relative",
  },
  cameraBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  cameraBadgeLoading: {
    height: "100%",
    width: "100%",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    ...textStyles.title,
    color: colors.text,
  },
  userEmail: {
    ...textStyles.subtitle,
    color: colors.textSoft,
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: "rgba(8, 51, 68, 0.05)",
    borderRadius: 12,
    minWidth: 34,
    minHeight: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  actionArea: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: " rgba(255, 255, 255, 0.05)",
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: "white",
    ...textStyles.input,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 4,
    borderRadius: 14,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  tabActive: {
    backgroundColor: colors.accent,
    borderRadius: 10,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.accentText,
  },
  listContainerStyle: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  listHeaderText: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(236, 254, 255, 0.6)",
    letterSpacing: 1.2,
  },
  createGroupBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  createGroupText: {
    ...textStyles.subtitle,
    color: colors.accent,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    opacity: 0.5,
  },
  emptyText: {
    color: "white",
    marginTop: 8,
    ...textStyles.input,
  },
  groupAvatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accentMuted,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
