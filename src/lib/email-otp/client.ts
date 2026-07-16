type ApiResult<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; errors?: Record<string, string> };

export async function sendEmailOtp(email: string): Promise<
  ApiResult<{ email: string; expiresInSeconds: number }>
> {
  const response = await fetch("/api/email-otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  return response.json();
}

export async function verifyEmailOtp(
  email: string,
  otp: string,
): Promise<ApiResult<{ email: string }>> {
  const response = await fetch("/api/email-otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, otp }),
  });
  return response.json();
}
