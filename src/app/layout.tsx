import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AppProviders from "@/components/providers/app-providers";

// Vendor CSS — import via JS so Turbopack resolves node_modules correctly
import "swiper/swiper-bundle.css";
import "nouislider/dist/nouislider.min.css";
import "flatpickr/dist/flatpickr.min.css";
import "dropzone/dist/dropzone.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "preline/variants.css";
import "simplebar/dist/simplebar.css";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Yum - Food Delivery",
    template: "%s | Yum",
  },
  description: "Yum - Multipurpose Food Tailwind CSS Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
