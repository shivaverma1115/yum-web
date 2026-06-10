type ApiResult<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; errors?: Record<string, string> };

export async function sendPhoneOtp(phone: string): Promise<
  ApiResult<{ phone: string; expiresInSeconds: number }>
> {
  const response = await fetch("/api/phone-otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  return response.json();
}

export async function verifyPhoneOtp(
  phone: string,
  otp: string,
): Promise<ApiResult<{ phone: string }>> {
  const response = await fetch("/api/phone-otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });
  return response.json();
}
