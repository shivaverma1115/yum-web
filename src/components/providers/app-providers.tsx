"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "@/context-api/cart-context";
import { ContextApiProvider } from "@/context-api/use-context";
import { ThemeProvider } from "@/components/providers/theme-provider";
import AuthCallbackAlerts from "@/components/auth/AuthCallbackAlerts";
import AuthCodeExchange from "@/components/auth/AuthCodeExchange";
import ThemeInit from "@/components/layout/ThemeInit";
import ThemeToggle from "@/components/layout/ThemeToggle";
import "react-toastify/dist/ReactToastify.css";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ContextApiProvider>
        <CartProvider>
          <Suspense fallback={null}>
            <AuthCodeExchange />
            <AuthCallbackAlerts />
          </Suspense>
          <ThemeInit />
          {children}
        </CartProvider>
      </ContextApiProvider>
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
