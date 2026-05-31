import type { ReactNode } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen flex flex-col">
        <AdminTopbar />
        <main className="flex-1">
          <div className="w-full lg:ps-64">
            <div className="p-6 page-content">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
