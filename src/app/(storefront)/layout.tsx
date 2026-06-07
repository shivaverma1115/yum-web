import type { ReactNode } from "react";
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
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
