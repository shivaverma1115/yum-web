"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useContextApi } from "@/context-api/use-context";
import { getSafeRedirect } from "@/lib/auth/redirect";
import { UserRole, type IUser } from "@/types/user";

type RegisterFormValues = Pick<
  IUser,
  "full_name" | "email"
> & {
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useContextApi();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = handleSubmit(async ({ full_name, email, password }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      if (data.data?.needsEmailConfirmation) {
        router.push("/login");
        return;
      }

      const user = data.data?.user as IUser | undefined;
      if (user) {
        setUser(user);
      }

      router.push(getSafeRedirect(
        searchParams.get("redirectTo"),
        user?.role ?? UserRole.USER
      ));
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
    }
  });

  return (
    <div>
      <div className="relative md:h-screen sm:py-16 py-36 flex items-center bg-gradient-to-b from-primary/5 via-primary/5 to-primary/10">
        <div className="container">
          <div className="flex justify-center items-center lg:max-w-lg">
            <div className="flex flex-col h-full">
              <div className="shrink">
                <div className="pb-10">
                  <Link href="/home" className="flex items-center">
                    <img
                      src="/images/logo-dark.png"
                      alt="logo"
                      className="h-12 flex dark:hidden"
                    />
                    <img
                      src="/images/logo-light.png"
                      alt="logo"
                      className="h-12 hidden dark:flex"
                    />
                  </Link>
                </div>

                <div>
                  <h1 className="text-3xl font-semibold text-default-800 mb-2">
                    Register
                  </h1>
                  <p className="text-sm text-default-500 max-w-md">
                    Create your account with your name, email, and password.
                  </p>
                </div>

                <form onSubmit={onSubmit} noValidate className="pt-16">
                  <div className="mb-6">
                    <label
                      className="block text-sm font-medium text-default-900 mb-2"
                      htmlFor="FullName"
                    >
                      Full Name
                    </label>
                    <input
                      id="FullName"
                      type="text"
                      placeholder="Enter your name"
                      autoComplete="name"
                      disabled={isSubmitting}
                      className="block w-full rounded-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60"
                      {...register("full_name", {
                        required: "Full name is required.",
                        minLength: {
                          value: 2,
                          message: "Enter at least 2 characters.",
                        },
                      })}
                    />
                    {errors.full_name?.message ? (
                      <span className="text-red-500 text-sm">
                        {errors.full_name.message}
                      </span>
                    ) : null}
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-sm font-medium text-default-900 mb-2"
                      htmlFor="LoggingEmailAddress"
                    >
                      Email
                    </label>
                    <input
                      id="LoggingEmailAddress"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      disabled={isSubmitting}
                      className="block w-full rounded-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60"
                      {...register("email", {
                        required: "Email is required.",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address.",
                        },
                      })}
                    />
                    {errors.email?.message ? (
                      <span className="text-red-500 text-sm">
                        {errors.email.message}
                      </span>
                    ) : null}
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-sm font-medium text-default-900 mb-2"
                      htmlFor="form-password"
                    >
                      Password
                    </label>
                    <div className="flex" data-x-password>
                      <input
                        id="form-password"
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        className="form-password block w-full rounded-s-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60"
                        {...register("password", {
                          required: "Password is required.",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters.",
                          },
                        })}
                      />
                      <button
                        type="button"
                        id="password-addon"
                        className="password-toggle inline-flex items-center justify-center py-2.5 px-4 border rounded-e-full bg-white -ms-px border-default-200 dark:bg-default-50"
                      >
                        <i
                          className="password-eye-on h-5 w-5 text-default-600"
                          data-lucide="eye"
                        />
                        <i
                          className="password-eye-off h-5 w-5 text-default-600"
                          data-lucide="eye-off"
                        />
                      </button>
                    </div>
                    {errors.password?.message ? (
                      <span className="text-red-500 text-sm">
                        {errors.password.message}
                      </span>
                    ) : null}
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-sm font-medium text-default-900 mb-2"
                      htmlFor="form-confirm-password"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="form-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      className="block w-full rounded-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60"
                      {...register("confirmPassword", {
                        required: "Please confirm your password.",
                        validate: (value) =>
                          value === password || "Passwords do not match.",
                      })}
                    />
                    {errors.confirmPassword?.message ? (
                      <span className="text-red-500 text-sm">
                        {errors.confirmPassword.message}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex justify-center mb-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative inline-flex items-center justify-center px-6 py-3 rounded-full text-base bg-primary text-white capitalize transition-all hover:bg-primary-500 w-full disabled:opacity-60"
                    >
                      {isSubmitting ? "Creating account..." : "Register"}
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        type="button"
                        className=""
                        aria-label="Sign up with Google"
                      >
                        <img
                          src="/images/icons/google.svg"
                          alt=""
                          className="h-8 w-8"
                        />
                      </button>

                      <button
                        type="button"
                        className=""
                        aria-label="Sign up with Facebook"
                      >
                        <img
                          src="/images/icons/facebook.svg"
                          alt=""
                          className="h-8 w-8"
                        />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="grow flex items-end justify-center mt-16">
                <p className="text-default-700 text-center mt-auto">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary ms-1">
                    <b>Login</b>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="absolute top-1/2 -translate-y-1/3 start-0 end-0 w-full -z-10">
            <img
              src="/images/other/wawe.png"
              className="w-full opacity-50 flex"
              alt=""
            />
          </div>

          <div className="absolute top-0 end-0 hidden xl:flex h-5/6">
            <img
              src="/images/other/auth-bg.png"
              className="w-full z-0"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="fixed lg:bottom-5 end-5 bottom-18 flex flex-col items-center bg-primary/25 rounded-full z-10">
        <button
          type="button"
          className="rounded-full h-10 w-10 bg-primary text-white flex justify-center items-center z-20"
        >
          <i className="h-5 w-5" data-lucide="sun" id="light-theme" />
          <i className="h-5 w-5" data-lucide="moon" id="dark-theme" />
        </button>
      </div>
    </div>
  );
}
