"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { BusinessSettingsProvider } from "@/context-api/business-settings-context";
import { CartProvider } from "@/context-api/cart-context";
import { ContextApiProvider } from "@/context-api/use-context";
import { OtpModalProvider } from "@/context-api/otp-modal-context";
import { ThemeProvider } from "@/components/providers/theme-provider";
import AuthCallbackAlerts from "@/components/auth/AuthCallbackAlerts";
import AuthCodeExchange from "@/components/auth/AuthCodeExchange";
import ThemeInit from "@/components/layout/ThemeInit";
import ThemeToggle from "@/components/layout/ThemeToggle";
import DevelopmentModeBanner from "@/components/layout/DevelopmentModeBanner";
import EnableNotificationButton from "@/components/layout/EnableNotificationButton";
import type { BusinessSettings } from "@/types/business-settings";
import "react-toastify/dist/ReactToastify.css";

type AppProvidersProps = {
  children: ReactNode;
  initialBusinessSettings?: BusinessSettings;
};

export default function AppProviders({
  children,
  initialBusinessSettings,
}: AppProvidersProps) {
  return (
    <ThemeProvider>
      <BusinessSettingsProvider initialSettings={initialBusinessSettings}>
        <ContextApiProvider>
          <OtpModalProvider>
            <CartProvider>
              <div className="sticky top-0 z-[100]">
                <DevelopmentModeBanner />
                <EnableNotificationButton />
              </div>
              <Suspense fallback={null}>
                <AuthCodeExchange />
                <AuthCallbackAlerts />
              </Suspense>
              <ThemeInit />
              {children}
            </CartProvider>
          </OtpModalProvider>
        </ContextApiProvider>
        <ThemeToggle />
      </BusinessSettingsProvider>
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
