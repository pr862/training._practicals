import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../features/auth/LoginScreen';
import RegisterScreen from '../../features/auth/RegisterScreen';
import HomeScreen from '../../features/home/HomeScreen';
import ChatScreen from '../../features/chat/ChatScreen';
import { colors } from '../../../packages/style/theme';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Chat: { type: 'user'; data: any } | { type: 'group'; data: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  user: any;
  currentUserProfile?: any;
  otherUsers?: any[];
  groupChats?: any[];
  chatPreviewsByUserId?: Record<string, { unreadCount: number; lastMessageTime: string }>;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  onCreateGroup: (groupName: string, memberIds: string[]) => Promise<void>;
  onLogoutClick?: () => void;
  isProfileImageUploading?: boolean;
  isUsersLoading?: boolean;
  onProfileEdit: (name: string, imageUri?: string | null, removePhoto?: boolean) => Promise<void>;
}

export const RootNavigator: React.FC<RootNavigatorProps> = ({
  user,
  currentUserProfile,
  otherUsers = [],
  groupChats = [],
  chatPreviewsByUserId = {},
  searchQuery = "",
  onSearchChange = () => { },
  onCreateGroup,
  onLogoutClick = () => { },
  isProfileImageUploading = false,
  isUsersLoading = false,
  onProfileEdit
}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="Home" >
            {(props) => (
              <HomeScreen
                {...props}
                currentUser={currentUserProfile}
                otherUsers={otherUsers}
                groupChats={groupChats}
                chatPreviewsByUserId={chatPreviewsByUserId}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                onCreateGroup={onCreateGroup}
                onLogoutClick={onLogoutClick}
                isProfileImageUploading={isProfileImageUploading}
                isUsersLoading={isUsersLoading}
                onProfileEdit={onProfileEdit}
                
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              animation: 'none',
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
