import type { AdminUserRole } from "@prisma/client";

import type { AdminSession } from "@/lib/admin-auth";
import { requireAdministratorSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type AdminActivityInput = {
  session: Pick<AdminSession, "userId" | "email" | "name" | "role">;
  action: string;
  entityType: string;
  entityId?: string | null;
  entityLabel: string;
  message: string;
};

export type AdminActivityItem = {
  id: string;
  adminUserName: string;
  adminUserEmail: string;
  adminUserRole: AdminUserRole;
  action: string;
  entityType: string;
  entityId: string | null;
  entityLabel: string;
  message: string;
  createdAt: Date;
};

export async function recordAdminActivity({
  session,
  action,
  entityType,
  entityId,
  entityLabel,
  message,
}: AdminActivityInput) {
  try {
    await prisma.adminActivityLog.create({
      data: {
        adminUserId: session.userId,
        adminUserName: session.name,
        adminUserEmail: session.email,
        adminUserRole: session.role,
        action,
        entityType,
        entityId: entityId ?? null,
        entityLabel,
        message,
      },
    });
  } catch (error) {
    console.error("Admin activity log failed", error);
  }
}

export async function getAdminActivity(limit = 50): Promise<AdminActivityItem[]> {
  await requireAdministratorSession("/admin");

  return prisma.adminActivityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
