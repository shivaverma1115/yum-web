import type { ReactNode } from "react";
import AdminLayoutShell from "@/components/layout/AdminLayoutShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
