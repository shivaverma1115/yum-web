export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

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