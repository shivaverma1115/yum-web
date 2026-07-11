import Home from "@/components/storefront/Home";
import Preloader from "@/components/layout/Preloader";
import { Suspense } from "react";
import { createStorefrontMetadata } from "@/lib/seo/create-storefront-metadata";

export async function generateMetadata() {
  return createStorefrontMetadata("home");
}

export default function HomePage() {
  return (
    <Suspense fallback={<Preloader />}>
      <Home />
    </Suspense>
  );
}
