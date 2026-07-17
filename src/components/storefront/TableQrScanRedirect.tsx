"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Preloader from "@/components/layout/Preloader";
import { saveTableQrContext } from "@/lib/table-qr/context";

type TableQrScanRedirectProps = {
  tableNumber: string;
  code: string;
};

export default function TableQrScanRedirect({
  tableNumber,
  code,
}: TableQrScanRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    saveTableQrContext({ table_number: tableNumber, code });
    router.replace("/products");
  }, [tableNumber, code, router]);

  return <Preloader />;
}
