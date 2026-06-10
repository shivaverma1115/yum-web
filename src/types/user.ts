export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export type UserVerificationStatus = {
  phone_verified: boolean;
  phone_verified_at: string | null;
  email_verified: boolean;
  email_verified_at: string | null;
};

export interface IUser {
  id?: string;
  email: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  zip_code: string;
  description: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export type IUserWithVerification = IUser & {
  verification: UserVerificationStatus;
};