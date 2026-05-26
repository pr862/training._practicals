import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/LoginScreen';
import RegisterScreen from '../features/auth/RegisterScreen';
import HomeScreen from '../features/home/HomeScreen';
import ChatScreen from '../features/chat/ChatScreen';
import { useAuth } from '../app/context/Auth';
import { colors } from '../../packages/style/theme';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Chat: { type: 'user'; data: any } | { type: 'group'; data: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoginRoute() {
  return <LoginScreen />;
}

function RegisterRoute() {
  return <RegisterScreen />;
}

function HomeRoute() {
  return <HomeScreen />;
}

function ChatRoute() {
  return <ChatScreen />;
}

export const RootNavigator: React.FC = () => {
  const { user } = useAuth();

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
          <Stack.Screen name="Home" component={HomeRoute} />
          <Stack.Screen
            name="Chat"
            component={ChatRoute}
            options={{
              animation: 'none',
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginRoute} />
          <Stack.Screen name="Register" component={RegisterRoute} />
        </>
      )}
    </Stack.Navigator>
  );
};
