"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";

export default function Login() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <div>
      <div className="relative md:h-screen sm:py-16 py-36 flex items-center bg-gradient-to-b from-primary/5 via-primary/5 to-primary/10">
        <div className="container">
          <div className="flex justify-center items-center lg:max-w-lg">
            <div className="flex flex-col h-full w-full">
              <div className="shrink">
                <div className="pb-10">
                  <Link href="/home" className="flex items-center">
                    <img
                      src="/images/logo-dark(1).png"
                      alt="logo"
                      className="h-12 flex dark:hidden"
                    />
                    <img
                      src="/images/logo-light(1).png"
                      alt="logo"
                      className="h-12 hidden dark:flex"
                    />
                  </Link>
                </div>

                <AuthForm mode="login" redirectTo={redirectTo} variant="page" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="absolute top-1/2 -translate-y-1/3 start-0 end-0 w-full -z-10">
            <img src="/images/other/wawe.png" className="w-full opacity-50 flex" alt="" />
          </div>

          <div className="absolute top-0 end-0 hidden xl:flex h-5/6">
            <img src="/images/other/auth-bg.png" className="w-full z-0" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
