"use server";

import { AdminUserRole, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdministratorSession } from "@/lib/admin-auth";
import { recordAdminActivity } from "@/lib/admin-activity";
import { hashAdminPassword } from "@/lib/admin-password";
import { prisma } from "@/lib/prisma";

const USERS_PATH = "/admin/utilisateurs";

const userFormSchema = z.object({
  email: z.string().trim().email("Indiquez un email valide.").toLowerCase(),
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères."),
  role: z.nativeEnum(AdminUserRole),
  password: z
    .string()
    .min(10, "Le mot de passe temporaire doit contenir au moins 10 caractères."),
});

const roleFormSchema = z.object({
  id: z.string().trim().min(1, "Utilisateur introuvable."),
  role: z.nativeEnum(AdminUserRole),
});

const idFormSchema = z.object({
  id: z.string().trim().min(1, "Utilisateur introuvable."),
});

const resetPasswordFormSchema = idFormSchema.extend({
  password: z
    .string()
    .min(10, "Le nouveau mot de passe doit contenir au moins 10 caractères."),
});

function getStringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getFirstErrorMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Formulaire invalide.";
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return "Un compte existe déjà avec cet email.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Action impossible pour le moment.";
}

function redirectWithError(message: string) {
  redirect(`${USERS_PATH}?error=${encodeURIComponent(message)}`);
}

async function ensureAnotherActiveAdmin(userId: string) {
  const otherAdminCount = await prisma.adminUser.count({
    where: {
      id: { not: userId },
      role: AdminUserRole.ADMIN,
      active: true,
    },
  });

  if (otherAdminCount === 0) {
    throw new Error("Gardez au moins un compte ADMIN actif.");
  }
}

export async function getAdminUsers() {
  await requireAdministratorSession("/admin");

  return prisma.adminUser.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      mustChangePassword: true,
      lastLoginAt: true,
      passwordChangedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createAdminUser(formData: FormData) {
  const session = await requireAdministratorSession(USERS_PATH);

  try {
    const values = userFormSchema.parse({
      email: getStringValue(formData, "email"),
      name: getStringValue(formData, "name"),
      role: getStringValue(formData, "role") || AdminUserRole.EDITOR,
      password: String(formData.get("password") ?? ""),
    });

    const createdUser = await prisma.adminUser.create({
      data: {
        email: values.email,
        name: values.name,
        passwordHash: hashAdminPassword(values.password),
        role: values.role,
        active: true,
        mustChangePassword: true,
      },
    });

    await recordAdminActivity({
      session,
      action: "create",
      entityType: "utilisateur",
      entityId: createdUser.id,
      entityLabel: createdUser.email,
      message: `${session.name} a créé le compte ${createdUser.email} avec le rôle ${createdUser.role}.`,
    });
  } catch (error) {
    redirectWithError(getFirstErrorMessage(error));
  }

  revalidatePath("/admin");
  revalidatePath(USERS_PATH);
  redirect(`${USERS_PATH}?invited=1`);
}

export async function updateAdminUserRole(formData: FormData) {
  const session = await requireAdministratorSession(USERS_PATH);

  try {
    const values = roleFormSchema.parse({
      id: getStringValue(formData, "id"),
      role: getStringValue(formData, "role"),
    });

    const user = await prisma.adminUser.findUnique({
      where: { id: values.id },
      select: { id: true, active: true, email: true, role: true },
    });

    if (!user) {
      throw new Error("Utilisateur introuvable.");
    }

    if (session.userId === user.id && values.role !== AdminUserRole.ADMIN) {
      throw new Error("Vous ne pouvez pas retirer votre propre rôle ADMIN.");
    }

    if (
      user.role === AdminUserRole.ADMIN &&
      values.role !== AdminUserRole.ADMIN &&
      user.active
    ) {
      await ensureAnotherActiveAdmin(user.id);
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id: values.id },
      data: { role: values.role },
    });

    await recordAdminActivity({
      session,
      action: "role",
      entityType: "utilisateur",
      entityId: updatedUser.id,
      entityLabel: updatedUser.email,
      message: `${session.name} a changé le rôle de ${updatedUser.email} de ${user.role} à ${updatedUser.role}.`,
    });
  } catch (error) {
    redirectWithError(getFirstErrorMessage(error));
  }

  revalidatePath("/admin");
  revalidatePath(USERS_PATH);
  redirect(`${USERS_PATH}?roleUpdated=1`);
}

export async function toggleAdminUserActive(formData: FormData) {
  const session = await requireAdministratorSession(USERS_PATH);

  try {
    const values = idFormSchema.parse({
      id: getStringValue(formData, "id"),
    });

    const user = await prisma.adminUser.findUnique({
      where: { id: values.id },
      select: { id: true, active: true, email: true, role: true },
    });

    if (!user) {
      throw new Error("Utilisateur introuvable.");
    }

    if (session.userId === user.id && user.active) {
      throw new Error("Vous ne pouvez pas désactiver votre propre compte.");
    }

    if (user.active && user.role === AdminUserRole.ADMIN) {
      await ensureAnotherActiveAdmin(user.id);
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id: values.id },
      data: { active: !user.active },
    });

    await recordAdminActivity({
      session,
      action: "active",
      entityType: "utilisateur",
      entityId: updatedUser.id,
      entityLabel: updatedUser.email,
      message: `${session.name} a ${
        updatedUser.active ? "réactivé" : "désactivé"
      } le compte ${updatedUser.email}.`,
    });
  } catch (error) {
    redirectWithError(getFirstErrorMessage(error));
  }

  revalidatePath("/admin");
  revalidatePath(USERS_PATH);
  redirect(`${USERS_PATH}?active=1`);
}

export async function resetAdminUserPassword(formData: FormData) {
  const session = await requireAdministratorSession(USERS_PATH);

  try {
    const values = resetPasswordFormSchema.parse({
      id: getStringValue(formData, "id"),
      password: String(formData.get("password") ?? ""),
    });

    const updatedUser = await prisma.adminUser.update({
      where: { id: values.id },
      data: {
        passwordHash: hashAdminPassword(values.password),
        mustChangePassword: true,
        passwordChangedAt: null,
      },
    });

    await recordAdminActivity({
      session,
      action: "password",
      entityType: "utilisateur",
      entityId: updatedUser.id,
      entityLabel: updatedUser.email,
      message: `${session.name} a réinitialisé le mot de passe de ${updatedUser.email}.`,
    });
  } catch (error) {
    redirectWithError(getFirstErrorMessage(error));
  }

  revalidatePath(USERS_PATH);
  redirect(`${USERS_PATH}?password=1`);
}
