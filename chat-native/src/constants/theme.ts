import type { TextStyle } from "react-native";

export const colors = {
  accent: "#916976",
  accentMuted: "rgba(137, 98, 111, 0.15)",
  accentText: "#FFFFFF",
  background: "#1E1B1D",
  surface: "#161415",
  surfaceRaised: "#292427",
  border: "#3D3538",
  text: "#F4EFF2",
  textMuted: "#9D858E",
  textSoft: "#6b6b6e",
  danger: "#e11d48",
  icon: "#4E4E52"
};

export const textStyles = {
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 0,
  },
  screenSubtitle: {
    fontSize: 16,
    fontWeight: "400",
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    fontSize: 14,
  },
  error: {
    fontSize: 12,
    fontWeight: "500",
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalbutton:{
    fontSize:13,
    fontWeight: 700
  },
  footer: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: "600",
  },
  helper: {
    fontSize: 13,
    fontWeight: "500",
  },
} as const satisfies Record<string, TextStyle>;
