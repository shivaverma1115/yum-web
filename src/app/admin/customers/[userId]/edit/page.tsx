import Preloader from "@/components/layout/Preloader";
import type { Metadata } from "next";
import { Suspense } from "react";
import UserEditWrapper from "./components/UserEditWrapper";

export const metadata: Metadata = {
  title: "Edit Customer",
  description: "Edit customer details",
};

export default function CustomerEditPage() {
  return (
    <Suspense fallback={<Preloader />}>
      <UserEditWrapper />
    </Suspense>
  );
}

