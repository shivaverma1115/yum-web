"use client";

import { useCallback, useState, type ReactNode } from "react";
import ProfileSidebar from "@/components/layout/ProfileSidebar";
import ProfileTopbar from "@/components/layout/ProfileTopbar";

type LayoutShellProps = {
  children: ReactNode;
};

export default function LayoutShell({ children }: LayoutShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);

  return (
    <>
      {mobileSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-50 bg-default-900/50 lg:hidden"
          onClick={closeMobileSidebar}
        />
      ) : null}

      <ProfileSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />

      <div className="min-h-screen flex flex-col">
        <ProfileTopbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1">
          <div className="w-full lg:ps-64">
            <div className="p-6 page-content">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
}
