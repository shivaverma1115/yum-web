import { randomBytes } from "crypto";

export function generateTableQrCode(): string {
  return randomBytes(8).toString("base64url");
}
