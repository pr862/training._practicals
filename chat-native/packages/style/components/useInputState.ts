import { useState } from "react";
import { TextInputProps} from "react-native";

export function useInputState(
  onFocus?:
  TextInputProps["onFocus"],
  onBlur?: TextInputProps["onBlur"]
) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus: NonNullable<TextInputProps["onFocus"]> = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };
  const handleBlur: NonNullable<TextInputProps["onBlur"]> = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return{ 
    isFocused,
    handleFocus,
    handleBlur,
  };
}