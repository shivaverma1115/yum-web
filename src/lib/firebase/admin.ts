import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getMessaging, type Messaging } from "firebase-admin/messaging";
import { isFirebaseAdminConfigured } from "@/lib/firebase/config";

let adminApp: App | null = null;
let parseError: string | null = null;

type ServiceAccount = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

function parseServiceAccountJson(raw: string): ServiceAccount | null {
  try {
    return JSON.parse(raw) as ServiceAccount;
  } catch {
    parseError = "FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.";
    return null;
  }
}

function loadServiceAccount(): ServiceAccount | null {
  parseError = null;

  const jsonRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (jsonRaw) {
    return parseServiceAccountJson(jsonRaw);
  }

  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (!filePath) return null;

  try {
    const absolutePath = resolve(process.cwd(), filePath);
    const fileRaw = readFileSync(absolutePath, "utf8");
    return parseServiceAccountJson(fileRaw);
  } catch {
    parseError = `Could not read FIREBASE_SERVICE_ACCOUNT_PATH: ${filePath}`;
    return null;
  }
}

export function getFirebaseAdminParseError(): string | null {
  if (!isFirebaseAdminConfigured()) {
    return "FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH is not set.";
  }

  loadServiceAccount();
  return parseError;
}

export function getFirebaseAdminProjectId(): string | null {
  const serviceAccount = loadServiceAccount();
  return serviceAccount?.project_id ?? null;
}

export function getFirebaseAdminApp(): App | null {
  if (!isFirebaseAdminConfigured()) return null;

  if (adminApp) return adminApp;

  const existing = getApps();
  if (existing.length > 0) {
    adminApp = existing[0]!;
    return adminApp;
  }

  const serviceAccount = loadServiceAccount();
  if (
    !serviceAccount?.project_id ||
    !serviceAccount.client_email ||
    !serviceAccount.private_key
  ) {
    if (!parseError) {
      parseError =
        "Service account JSON is missing project_id, client_email, or private_key.";
    }
    return null;
  }

  adminApp = initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
  });

  return adminApp;
}

export function getFirebaseMessaging(): Messaging | null {
  const app = getFirebaseAdminApp();
  if (!app) return null;
  return getMessaging(app);
}
