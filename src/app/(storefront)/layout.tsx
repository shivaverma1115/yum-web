import type { ReactNode } from "react";
import Preloader from "@/components/layout/Preloader";
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('@/components/layout/Navbar'));
const Footer = dynamic(() => import('@/components/layout/Footer'));
const BackToTop = dynamic(() => import('@/components/layout/BackToTop'));

export default function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
