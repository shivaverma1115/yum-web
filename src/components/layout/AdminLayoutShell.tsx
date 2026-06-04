"use client";

import { useCallback, useState, type ReactNode } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";

type AdminLayoutShellProps = {
  children: ReactNode;
};

export default function AdminLayoutShell({ children }: AdminLayoutShellProps) {
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

      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />

      <div className="min-h-screen flex flex-col">
        <AdminTopbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1">
          <div className="w-full lg:ps-64">
            <div className="p-6 page-content">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
}
