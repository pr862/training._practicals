import React from 'react';
import { View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/Auth';
import { RootNavigator } from './src/navigation/index';
import Loading from './src/components/Loading';
import { logoutUser } from './src/services/auth';
import { useUsersDirectory } from './src/hooks/useUsers';
import { colors } from './src/constants/theme';

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
