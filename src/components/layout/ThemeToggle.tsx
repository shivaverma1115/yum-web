"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, mounted, toggleTheme } = useTheme();

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`fixed lg:bottom-5 end-5 bottom-18 flex flex-col items-center bg-primary/25 rounded-full z-10 ${className}`}
    >
      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-full h-10 w-10 bg-primary text-white flex justify-center items-center z-20"
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? (
          <Sun className="h-5 w-5" id="light-theme" />
        ) : (
          <Moon className="h-5 w-5" id="dark-theme" />
        )}
      </button>
    </div>
  );
}
