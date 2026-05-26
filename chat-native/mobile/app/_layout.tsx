import React from 'react';
import { View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './context/Auth';
import { RootNavigator } from './index';
import Loading from '../../packages/style/components/Loading';
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
  const { loading } = useAuth();

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
        <RootNavigator />
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
