"use server";

import crypto from "node:crypto";

import { AdminUserRole, type AdminUser } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  hashAdminPassword,
  verifyAdminPassword,
} from "@/lib/admin-password";
import { prisma } from "@/lib/prisma";

const ADMIN_COOKIE_NAME = "cd51tt-admin-session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const ADMIN_PERMISSION_ERROR = "Action réservée à un administrateur.";
const EDITOR_ALLOWED_ROLES = [AdminUserRole.ADMIN, AdminUserRole.EDITOR] as const;
const CHANGE_PASSWORD_PATH = "/admin/mot-de-passe";

type LegacyCredentials = {
  email: string;
  password: string;
  secret: string;
};

export type AdminSession = {
  userId: string;
  email: string;
  name: string;
  role: AdminUserRole;
  mustChangePassword: boolean;
  expiresAt: number;
};

const changePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Indiquez votre mot de passe actuel."),
    newPassword: z
      .string()
      .min(10, "Le nouveau mot de passe doit contenir au moins 10 caractères."),
    confirmPassword: z.string().min(1, "Confirmez le nouveau mot de passe."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Les deux nouveaux mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    message: "Le nouveau mot de passe doit être différent de l'ancien.",
    path: ["newPassword"],
  });

function getLegacyCredentials(): LegacyCredentials {
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

function timingSafeEqual(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  if (firstBuffer.length !== secondBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(firstBuffer, secondBuffer);
}

function buildSessionValue(
  user: Pick<
    AdminUser,
    "id" | "email" | "name" | "role" | "mustChangePassword"
  >,
) {
  const { secret } = getLegacyCredentials();

  if (!secret) {
    return null;
  }

  const session: AdminSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = createSignature(payload, secret);

  return `${payload}.${signature}`;
}

async function readSessionValue(rawValue: string | undefined) {
  if (!rawValue) {
    return null;
  }

  const [payload, signature] = rawValue.split(".");
  const { secret } = getLegacyCredentials();

  if (!payload || !signature || !secret) {
    return null;
  }

  const expectedSignature = createSignature(payload, secret);

  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  let session: AdminSession;

  try {
    session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (
    !session.userId ||
    !session.email ||
    !session.name ||
    !Object.values(AdminUserRole).includes(session.role) ||
    !Number.isFinite(session.expiresAt) ||
    session.expiresAt <= Math.floor(Date.now() / 1000)
  ) {
    return null;
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.userId },
    select: {
      active: true,
      email: true,
      name: true,
      role: true,
      mustChangePassword: true,
    },
  });

  if (!user?.active) {
    return null;
  }

  return {
    ...session,
    email: user.email,
    name: user.name,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  };
}

async function findUserForLogin(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (user) {
    return user.active && verifyAdminPassword(password, user.passwordHash)
      ? user
      : null;
  }

  const userCount = await prisma.adminUser.count();
  const credentials = getLegacyCredentials();

  if (
    userCount > 0 ||
    !credentials.email ||
    !credentials.password ||
    email !== credentials.email.toLowerCase() ||
    password !== credentials.password
  ) {
    return null;
  }

  return prisma.adminUser.create({
    data: {
      email,
      name: process.env.ADMIN_NAME ?? "Administrateur",
      passwordHash: hashAdminPassword(password),
      role: AdminUserRole.ADMIN,
      active: true,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
      lastLoginAt: new Date(),
    },
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return readSessionValue(sessionValue);
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminSession());
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireAdminRole(
  allowedRoles: readonly AdminUserRole[],
  redirectPath = "/admin",
) {
  const session = await requireAdminSession();

  if (!allowedRoles.includes(session.role)) {
    const separator = redirectPath.includes("?") ? "&" : "?";
    redirect(
      `${redirectPath}${separator}error=${encodeURIComponent(
        ADMIN_PERMISSION_ERROR,
      )}`,
    );
  }

  return session;
}

export async function requireEditorSession(redirectPath = "/admin") {
  return requireAdminRole(EDITOR_ALLOWED_ROLES, redirectPath);
}

export async function requireAdministratorSession(redirectPath = "/admin") {
  return requireAdminRole([AdminUserRole.ADMIN], redirectPath);
}

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const { secret } = getLegacyCredentials();

  if (!secret) {
    redirect("/admin/login?error=config");
  }

  const user = await findUserForLogin(email, password);

  if (!user) {
    redirect("/admin/login?error=credentials");
  }

  const sessionValue = buildSessionValue(user);

  if (!sessionValue) {
    redirect("/admin/login?error=config");
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  redirect(user.mustChangePassword ? CHANGE_PASSWORD_PATH : "/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}

function getPasswordErrorMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Formulaire invalide.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Impossible de changer le mot de passe pour le moment.";
}

export async function changeOwnAdminPassword(formData: FormData) {
  const session = await requireAdminSession();

  try {
    const values = changePasswordFormSchema.parse({
      currentPassword: String(formData.get("currentPassword") ?? ""),
      newPassword: String(formData.get("newPassword") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });

    const user = await prisma.adminUser.findUnique({
      where: { id: session.userId },
      select: { id: true, passwordHash: true, active: true },
    });

    if (!user?.active) {
      throw new Error("Compte introuvable ou désactivé.");
    }

    if (!verifyAdminPassword(values.currentPassword, user.passwordHash)) {
      throw new Error("Le mot de passe actuel est incorrect.");
    }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        passwordHash: hashAdminPassword(values.newPassword),
        mustChangePassword: false,
        passwordChangedAt: new Date(),
      },
    });
  } catch (error) {
    redirect(
      `${CHANGE_PASSWORD_PATH}?error=${encodeURIComponent(
        getPasswordErrorMessage(error),
      )}`,
    );
  }

  revalidatePath("/admin");
  revalidatePath(CHANGE_PASSWORD_PATH);
  redirect("/admin?password=changed");
}
