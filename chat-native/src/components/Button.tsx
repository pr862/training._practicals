import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle
} from 'react-native';
import { colors, textStyles } from '../constants/theme';
import Loading from './Loading';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button = ({
  onPress,
  children,
  variant = 'primary',
  loading,
  disabled,
  style,
  textStyle
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const indicatorColor = variant === 'primary' ? colors.accentText : colors.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <Loading size="small" iconColor={indicatorColor} style={styles.loading} />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.text,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  loading: {
    height: "100%",
    width: "100%",
  },
  text: {
    ...textStyles.button,
  },
  primaryText: {
    color: colors.accentText,
  },
  secondaryText: {
    color: '#334155',
  },
  dangerText: {
    color: colors.danger,
  },
});

export default Button;
