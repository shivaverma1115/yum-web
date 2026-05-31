import Login from "@/components/auth/Login";
import Preloader from "@/components/layout/Preloader";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Yum account",
};

export default function LoginPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <Login />
        </Suspense>
    )
}

