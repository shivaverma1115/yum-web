import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeEmail } from "@/lib/email-otp/email";
import {
  getNationalMobileDigits,
  getPhoneDigits,
  isValidPhoneNumber,
  normalizePhoneE164,
  phonesMatchNational,
} from "@/lib/phone-otp/phone";

function phoneLookupValues(phone: string): string[] {
  const e164 = normalizePhoneE164(phone);
  const digits = getPhoneDigits(phone);
  const national = getNationalMobileDigits(phone);
  return [
    ...new Set(
      [e164, digits, digits ? `+${digits}` : "", national].filter(Boolean),
    ),
  ];
}

function phoneMatchesLookup(stored: string, phone: string): boolean {
  const trimmed = stored.trim();
  if (!trimmed || trimmed === "-") return false;

  const candidates = new Set(phoneLookupValues(phone));
  if (candidates.has(trimmed) || candidates.has(normalizePhoneE164(trimmed))) {
    return true;
  }

  return phonesMatchNational(trimmed, phone);
}

async function findAuthUserIdByPhone(
  admin: SupabaseClient,
  phone: string,
): Promise<string | null> {
  if (!isValidPhoneNumber(phone)) return null;

  let page = 1;
  const perPage = 1000;
  const maxPages = 20;

  while (page <= maxPages) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error || !data.users?.length) break;

    for (const user of data.users) {
      if (user.phone && phoneMatchesLookup(user.phone, phone)) {
        return user.id;
      }
    }

    if (data.users.length < perPage) break;
    page += 1;
  }

  return null;
}

async function findProfileIdByPhone(
  admin: SupabaseClient,
  phone: string,
): Promise<string | null> {
  if (!isValidPhoneNumber(phone)) return null;

  for (const candidate of phoneLookupValues(phone)) {
    const { data, error } = await admin
      .from("profiles")
      .select("id, phone")
      .eq("phone", candidate)
      .maybeSingle();

    if (!error && data) {
      return data.id as string;
    }
  }

  const national = getNationalMobileDigits(phone);
  if (national.length !== 10) return null;

  const { data: rows, error } = await admin
    .from("profiles")
    .select("id, phone")
    .not("phone", "eq", "")
    .not("phone", "eq", "-");

  if (error || !rows?.length) return null;

  const match = rows.find((row) => phoneMatchesLookup(row.phone, phone));
  return match?.id ?? null;
}

export async function findUserIdByPhone(
  admin: SupabaseClient,
  phone: string,
): Promise<string | null> {
  const byAuth = await findAuthUserIdByPhone(admin, phone);
  if (byAuth) return byAuth;

  return findProfileIdByPhone(admin, phone);
}

export async function findProfileIdByEmail(
  admin: SupabaseClient,
  email: string,
): Promise<string | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const { data, error } = await admin
    .from("profiles")
    .select("id")
    .ilike("email", normalized)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data.id as string;
}
