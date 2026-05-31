"use client";

import { useContext } from "react";
import { ThemeContext } from "@/components/providers/theme-provider";

export type { Theme } from "@/components/providers/theme-provider";
export {
  ThemeProvider,
  applyThemeClass,
  persistTheme,
  readStoredTheme,
} from "@/components/providers/theme-provider";

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
