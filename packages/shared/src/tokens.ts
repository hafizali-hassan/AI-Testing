/**
 * Bizniss design tokens. Single source of truth for web (CSS variables) and mobile (StyleSheet).
 */
export const colors = {
  brand: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
  },
  ink: "#1c1917",
  muted: "#78716c",
  surface: "#ffffff",
  background: "#fffaf5",
  border: "#f1e4d8",
  success: "#16a34a",
  danger: "#dc2626",
} as const;

export const radius = 15;

export const fontFamily = "Inter";

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

/** Minimum touch target size (px / dp). */
export const minTouchTarget = 44;
