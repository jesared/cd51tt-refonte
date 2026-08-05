"use server";

import crypto from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "cd51tt-admin-session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

type Credentials = {
  email: string;
  password: string;
  secret: string;
};

function getCredentials(): Credentials {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    email: process.env.ADMIN_EMAIL ?? (isProduction ? "" : "admin@cd51tt.fr"),
    password: process.env.ADMIN_PASSWORD ?? (isProduction ? "" : "admin1234"),
    secret:
      process.env.ADMIN_SESSION_SECRET ??
      (isProduction ? "" : "cd51tt-dev-session-secret"),
  };
}

function createSignature(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function buildSessionValue(email: string, secret: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${email}:${expiresAt}`;
  const signature = createSignature(payload, secret);

  return `${payload}:${signature}`;
}

function verifySessionValue(rawValue: string | undefined) {
  if (!rawValue) {
    return false;
  }

  const [email, expiresAtRaw, signature] = rawValue.split(":");
  const { secret } = getCredentials();

  if (!email || !expiresAtRaw || !signature || !secret) {
    return false;
  }

  const payload = `${email}:${expiresAtRaw}`;
  const expectedSignature = createSignature(payload, secret);

  try {
    const isValidSignature = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );

    if (!isValidSignature) {
      return false;
    }
  } catch {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);

  return Number.isFinite(expiresAt) && expiresAt > Math.floor(Date.now() / 1000);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return verifySessionValue(sessionValue);
}

export async function requireAdminSession() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }
}

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const credentials = getCredentials();

  if (!credentials.email || !credentials.password || !credentials.secret) {
    redirect("/admin/login?error=config");
  }

  if (
    email !== credentials.email.toLowerCase() ||
    password !== credentials.password
  ) {
    redirect("/admin/login?error=credentials");
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, buildSessionValue(email, credentials.secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
