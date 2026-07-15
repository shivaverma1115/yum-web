import type { ReactNode } from "react";
import LayoutShell from "@/components/layout/LayoutShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <LayoutShell>{children}</LayoutShell>;
}
