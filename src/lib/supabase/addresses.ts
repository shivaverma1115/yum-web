import type { SupabaseClient } from "@supabase/supabase-js";
import { ERROR_MESSAGE_GENERIC } from "@/lib/constants";
import type {
  IUserAddress,
  UserAddressInput,
  UserAddressType,
  UserAddressesByType,
} from "@/types/user-address";

const ADDRESS_COLUMNS =
  "id, user_id, address_type, first_name, last_name, company_name, address_line, country, state, city, zip_code, email, phone, created_at, updated_at";

export type ListUserAddressesResult =
  | { success: true; addresses: UserAddressesByType }
  | { success: false; message: string; status: number };

export type UpsertUserAddressResult =
  | { success: true; address: IUserAddress }
  | {
      success: false;
      message: string;
      status: number;
      errors?: Record<string, string>;
    };

function emptyAddresses(): UserAddressesByType {
  return { billing: null, shipping: null };
}

function normalizeAddressInput(input: UserAddressInput): UserAddressInput {
  return {
    address_type: input.address_type,
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    company_name: input.company_name.trim(),
    address_line: input.address_line.trim(),
    country: input.country.trim(),
    state: input.state.trim(),
    city: input.city.trim(),
    zip_code: input.zip_code.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
  };
}

export async function listUserAddressesWithSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<ListUserAddressesResult> {
  const { data, error } = await supabase
    .from("user_addresses")
    .select(ADDRESS_COLUMNS)
    .eq("user_id", userId);

  if (error) {
    return {
      success: false,
      message: error.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
    };
  }

  const addresses = emptyAddresses();

  for (const row of data ?? []) {
    const address = row as IUserAddress;
    if (address.address_type === "billing") {
      addresses.billing = address;
    } else if (address.address_type === "shipping") {
      addresses.shipping = address;
    }
  }

  return { success: true, addresses };
}

export async function upsertUserAddressWithSupabase(
  supabase: SupabaseClient,
  userId: string,
  input: UserAddressInput,
): Promise<UpsertUserAddressResult> {
  const values = normalizeAddressInput(input);

  if (!values.first_name) {
    return {
      success: false,
      message: "First name is required.",
      status: 400,
      errors: { first_name: "First name is required." },
    };
  }

  if (!values.last_name) {
    return {
      success: false,
      message: "Last name is required.",
      status: 400,
      errors: { last_name: "Last name is required." },
    };
  }

  if (
    values.address_type !== "billing" &&
    values.address_type !== "shipping"
  ) {
    return {
      success: false,
      message: "Invalid address type.",
      status: 400,
      errors: { address_type: "Invalid address type." },
    };
  }

  const { data, error } = await supabase
    .from("user_addresses")
    .upsert(
      {
        user_id: userId,
        ...values,
      },
      { onConflict: "user_id,address_type" },
    )
    .select(ADDRESS_COLUMNS)
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? ERROR_MESSAGE_GENERIC,
      status: 400,
      errors: {},
    };
  }

  return {
    success: true,
    address: data as IUserAddress,
  };
}

export function isUserAddressType(value: string): value is UserAddressType {
  return value === "billing" || value === "shipping";
}
