export type UserAddressType = "billing" | "shipping";

export type IUserAddress = {
  id?: string;
  user_id: string;
  address_type: UserAddressType;
  first_name: string;
  last_name: string;
  company_name: string;
  address_line: string;
  zip_code: string;
  email: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
};

export type UserAddressInput = Omit<
  IUserAddress,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export type UserAddressesByType = {
  billing: IUserAddress | null;
  shipping: IUserAddress | null;
};
