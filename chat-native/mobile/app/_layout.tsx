import React from 'react';
import { View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './context/Auth';
import { RootNavigator } from './navigation';
import Loading from '../../packages/style/components/Loading';
import { logoutUser } from '../../packages/data/auth/service';
import { useUsersDirectory } from '../features/home/useUsers';
import { colors } from '../../packages/style/theme';

const navigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

function AppContent() {
  const { user, loading } = useAuth();

  const {
    otherUsers,
    loading: usersLoading,
    me,
    groupChats,
    chatPreviewsByUserId,
    searchQuery,
    setSearchQuery,
    handleCreateGroup,
    isProfileImageUploading,
    updateCurrentUserProfile,
  } = useUsersDirectory();

  const currentUserProfile = user ? {
    id: user.uid,
    uid: user.uid,
    email: me?.email || user.email || "",
    name: me?.name || user.displayName || "",
    photoURL: me?.photoURL || user.photoURL || "",
    createdAt: me?.createdAt,
  } : undefined;

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator
          user={user}
          currentUserProfile={currentUserProfile}
          otherUsers={otherUsers}
          groupChats={groupChats}
          chatPreviewsByUserId={chatPreviewsByUserId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateGroup={(groupName, memberIds) => handleCreateGroup(groupName, memberIds)}
          onLogoutClick={() => logoutUser()}
          isProfileImageUploading={isProfileImageUploading}
          isUsersLoading={usersLoading}
          onProfileEdit={async (name, imageUri, removePhoto) => {
            await updateCurrentUserProfile(name, imageUri ?? null, removePhoto);
          }}
        />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
