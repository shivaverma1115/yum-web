import { Suspense } from "react";
import AuthCallbackPage from "@/components/auth/AuthCallbackPage";
import Preloader from "@/components/layout/Preloader";

export default function AuthCallbackRoutePage() {
  return (
    <Suspense fallback={<Preloader />}>
      <AuthCallbackPage />
    </Suspense>
  );
}
