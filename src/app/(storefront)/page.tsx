import Preloader from "@/components/layout/Preloader";
import { Suspense } from "react";
import { createStorefrontMetadata } from "@/lib/seo/create-storefront-metadata";
import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/components/storefront/Home"));

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
