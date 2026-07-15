export function mapAuthContactDuplicateError(
  message: string,
  fields: { email?: string; phone?: string },
): { message: string; errors: Record<string, string>; status: 409 } | null {
  const lower = message.toLowerCase();
  if (
    !lower.includes("already") &&
    !lower.includes("registered") &&
    !lower.includes("exists") &&
    !lower.includes("duplicate")
  ) {
    return null;
  }

  const errors: Record<string, string> = {};
  if (fields.email) {
    errors.email = "This email is already registered to another account.";
  }
  if (fields.phone) {
    errors.phone =
      "This phone number is already registered to another account.";
  }

  if (!Object.keys(errors).length) {
    return {
      message: "This contact detail is already registered to another account.",
      errors: {},
      status: 409,
    };
  }

  const mappedMessage =
    errors.email && errors.phone
      ? "Email and phone are already in use."
      : (errors.email ?? errors.phone!);

  return { message: mappedMessage, errors, status: 409 };
}
