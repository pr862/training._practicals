import React, { forwardRef, useState, type ReactNode } from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps, type ViewStyle, type TextStyle } from 'react-native';
import { colors, textStyles } from '../constants/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  error?: string;
  errorStyle?: TextStyle;
  containerStyle?: ViewStyle;
  icon?: ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, labelStyle, inputStyle, errorStyle, icon, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const isEditable = props.editable !== false;

    const handleFocus = (e: any) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <View style={styles.inputWrapper}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              icon ? styles.inputWithIcon : styles.inputDefaultPadding,
              isFocused && styles.inputFocused,
              error ? styles.inputError : null,
              !isEditable && styles.inputDisabled,
              inputStyle,
            ]}
            placeholderTextColor={colors.icon}
            cursorColor={colors.icon}
            autoCapitalize="none"
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </View>
        {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    ...textStyles.formLabel,
    color: '#cac8c8',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    left: 14,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 48,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262626',
    backgroundColor: '#0F0F11',
    ...textStyles.input,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  inputDisabled: {
    backgroundColor: '#0A0A0B',
    borderColor: '#1A1A1A',
  },
  inputDefaultPadding: {
    paddingHorizontal: 16,
  },
  inputWithIcon: {
    paddingLeft: 44,
    paddingRight: 16,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    ...textStyles.error,
    color: colors.danger,
  },

});

Input.displayName = 'Input';
