import type { IUser } from "@/types/user";

type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
  errors?: Record<string, string>;
};

type ApiResult<T> = ApiSuccess<T> | ApiFailure;

async function parseApiResponse<T>(response: Response): Promise<ApiResult<T>> {
  const data = (await response.json().catch(() => ({}))) as ApiResult<T>;

  if (!response.ok || !data.success) {
    return {
      success: false,
      message:
        (!data.success && data.message) ||
        "Something went wrong. Please try again.",
      errors: !data.success ? data.errors : undefined,
    };
  }

  return data;
}

export async function loginWithEmailClient(
  email: string,
  password: string,
): Promise<ApiResult<{ user: IUser }>> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  return parseApiResponse<{ user: IUser }>(response);
}

export type RegisterEmailPayload = {
  email: string;
  password: string;
  phone?: string;
};

export async function registerWithEmailClient(
  payload: RegisterEmailPayload,
): Promise<ApiResult<{ user: IUser; needsEmailConfirmation: boolean }>> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return parseApiResponse<{ user: IUser; needsEmailConfirmation: boolean }>(
    response,
  );
}

export async function sendAuthPhoneOtpClient(
  phone: string,
): Promise<ApiResult<{ phone: string }>> {
  const response = await fetch("/api/auth/phone/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ phone }),
  });

  return parseApiResponse<{ phone: string }>(response);
}

export async function verifyAuthPhoneOtpClient(
  phone: string,
  otp: string,
): Promise<ApiResult<{ user: IUser; isNewUser: boolean }>> {
  const response = await fetch("/api/auth/phone/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ phone, otp }),
  });

  return parseApiResponse<{ user: IUser; isNewUser: boolean }>(response);
}
