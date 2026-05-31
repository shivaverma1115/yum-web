"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ThemeInit from "@/components/layout/ThemeInit";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeInit />
      {children}
      <ThemeToggle />
    </ThemeProvider>
  );
}
