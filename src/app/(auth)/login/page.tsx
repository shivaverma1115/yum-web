import AuthCallbackAlerts from "@/components/auth/AuthCallbackAlerts";
import Preloader from "@/components/layout/Preloader";
import type { Metadata } from "next";
import { Suspense } from "react";

import dynamic from "next/dynamic";
const Login = dynamic(() => import('@/components/auth/Login'));

export const metadata: Metadata = {
    title: "Login",
    description: "Sign in to your Yum account",
};

export default function LoginPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <AuthCallbackAlerts />
            <Login />
        </Suspense>
    )
}

