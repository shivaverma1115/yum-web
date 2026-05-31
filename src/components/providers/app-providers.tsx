"use client";

import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ThemeInit from "@/components/layout/ThemeInit";
import ThemeToggle from "@/components/layout/ThemeToggle";
import "react-toastify/dist/ReactToastify.css";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeInit />
      {children}
      <ThemeToggle />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
}
