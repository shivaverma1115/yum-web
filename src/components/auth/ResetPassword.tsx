"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type ResetFormValues = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");

  const onSubmit = handleSubmit(async ({ password: newPassword }) => {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        toast.error(data.message ?? "Something went wrong.");
        return;
      }

      toast.success(data.message);
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
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

                <div>
                  <h1 className="text-3xl font-semibold text-default-800 mb-2">
                    Reset Password
                  </h1>
                  <p className="text-sm text-default-500 max-w-md">
                    Choose a new password for your account.
                  </p>
                </div>

                <form onSubmit={onSubmit} noValidate className="pt-16">
                  <div className="mb-6">
                    <label
                      className="block text-sm font-medium text-default-900 mb-2"
                      htmlFor="new_password"
                    >
                      New Password
                    </label>
                    <input
                      id="new_password"
                      type="password"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      className="block w-full rounded-full py-2.5 px-4 bg-white border border-default-200 focus:ring-transparent focus:border-default-200 dark:bg-default-50 disabled:opacity-60"
                      {...register("password", {
                        required: "Password is required.",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters.",
                        },
                      })}
                    />
                    {errors.password?.message ? (
                      <span className="text-red-500 text-sm">
                        {errors.password.message}
                      </span>
                    ) : null}
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-sm font-medium text-default-900 mb-2"
                      htmlFor="confirm_new_password"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="confirm_new_password"
                      type="password"
                      placeholder="Confirm new password"
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

                  <div className="flex flex-col justify-center gap-4 mb-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative inline-flex items-center justify-center px-6 py-3 rounded-full text-base bg-primary text-white capitalize transition-all hover:bg-primary-500 w-full disabled:opacity-60"
                    >
                      {isSubmitting ? "Saving…" : "Reset Password"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="grow flex items-end justify-center mt-16">
                <p className="text-default-950 text-center mt-auto">
                  Back to
                  <Link href="/login" className="text-primary ms-1">
                    <span className="font-medium">Login</span>
                  </Link>
                </p>
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
