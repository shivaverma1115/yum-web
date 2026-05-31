import type { ReactNode } from "react";
import Preloader from "@/components/layout/Preloader";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Preloader />
      <AdminSidebar />
      <div className="min-h-screen flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  );
}
