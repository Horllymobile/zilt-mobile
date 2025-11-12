import { DefaultTheme } from "react-native-paper";

export const THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    // Primary brand color
    primary: "#775655", // Zilt primary
    primaryDark: "#553636", // darker background for cards/chats
    primaryDarker: "#442525", // even darker backgrounds, modals

    // Accent colors
    accent: "#6BCB77", // green for success/seen indicators
    secondary: "#E0D7F9", // lighter accent / highlights
    warning: "#FFD166", // notifications / unread badges
    error: "#EF476F", // errors / typing alerts
    info: "#4D96FF", // links, mentions

    // Backgrounds & surfaces
    background: "#553636", // main background
    surface: "#775655", // card surface
    overlay: "#331414", // modal overlay / dark layer

    // Text
    text: "#FFFFFF", // primary text for dark backgrounds
    textSecondary: "#C6A9A9", // secondary text
    textPlaceholder: "#A07878", // placeholder text

    // Optional extra
    disabled: "#B0B0B0",

    success: "",
  },
};
