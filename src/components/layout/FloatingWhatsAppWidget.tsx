"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { useBusinessSettings } from "@/context-api/business-settings-context";
import { useTheme } from "@/hooks/use-theme";
import { getPhoneDigits } from "@/lib/phone-otp/phone";

const FIRST_VISIT_KEY = "yum_whatsapp_first_visit";
const WELCOME_SOUND_SRC = "/sounds/whatsapp-notification.mp3";
const WELCOME_SOUND_DELAY_MS = 2500;

export default function FloatingWhatsAppWidget() {
  const pathname = usePathname();
  const { settings } = useBusinessSettings();
  const { theme, mounted: themeMounted } = useTheme();
  const [firstVisit, setFirstVisit] = useState(false);

  const phoneNumber = getPhoneDigits(settings.support.phone);
  const siteName = settings.general.site_name.trim() || "Yum";

  useEffect(() => {
    try {
      if (sessionStorage.getItem(FIRST_VISIT_KEY)) {
        return;
      }
      sessionStorage.setItem(FIRST_VISIT_KEY, "1");
      setFirstVisit(true);
    } catch {
      // sessionStorage unavailable (e.g. strict private mode)
    }
  }, []);

  useEffect(() => {
    if (!firstVisit) {
      return;
    }

    const timer = window.setTimeout(() => {
      const audio = new Audio(WELCOME_SOUND_SRC);
      audio.volume = 0.55;
      void audio.play().catch(() => {
        // Autoplay may be blocked until the user interacts with the page.
      });
    }, WELCOME_SOUND_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [firstVisit]);

  if (!phoneNumber || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <FloatingWhatsApp
      phoneNumber={phoneNumber}
      accountName={siteName}
      avatar="/images/logo-dark(1).png"
      statusMessage="Typically replies within 1 hour"
      chatMessage={`Hello! 👋\nHow can we help you with your order?`}
      placeholder="Type a message..."
      allowClickAway={false}
      allowEsc
      darkMode={themeMounted && theme === "dark"}
      notification={firstVisit}
      notificationSound={false}
      notificationDelay={60}
      notificationLoop={1}
      className="z-50"
    />
  );
}
