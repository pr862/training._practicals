import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../constants/theme';

interface LoadingProps {
  label?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
  iconColor?: string;
  size?: "small" | "large";
}

export default function Loading({
  label,
  fullScreen = false,
  style,
  iconColor = colors.accent,
  size = "large",
}: LoadingProps) {
  return (
    <View style={[
      styles.container,
      fullScreen ? styles.fullScreen : styles.inline,
      style
    ]}>
      <View style={styles.contentContainer}>
        <ActivityIndicator size={size} color={iconColor} />
        {label ? (
          <Text style={styles.labelText}>{label}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inline: {
    height: '100%',
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    gap: 12,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.accent,
  },
});
