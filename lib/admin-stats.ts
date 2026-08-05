"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";

import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminClubs } from "@/lib/admin-clubs";
import { ffttClient } from "@/lib/fftt/client";
import { prisma } from "@/lib/prisma";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

function isMissingTableError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021"
  );
}

function serializeErrorMessage(error: unknown) {
  if (isMissingTableError(error)) {
    return "La table des statistiques n'existe pas encore. Lancez prisma db push.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue.";
}

const hasLicenseeStatsTable = cache(async () => {
  try {
    const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>(Prisma.sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'FfttClubLicenseeStat'
      ) AS "exists"
    `);

    return rows[0]?.exists ?? false;
  } catch {
    return false;
  }
});

export async function getAdminStats() {
  const clubs = await getAdminClubs();
  const activeClubs = clubs.filter((club) => club.active);
  const clubsWithFfttId = activeClubs.filter((club) => Boolean(club.ffttId));
  const cities = Array.from(new Set(activeClubs.map((club) => club.city)));

  if (!(await hasLicenseeStatsTable())) {
    return {
      clubs,
      activeClubCount: activeClubs.length,
      ffttClubCount: clubsWithFfttId.length,
      cityCount: cities.length,
      licenseeTotal: null,
      syncedClubCount: 0,
      failedClubCount: 0,
      lastSyncedAt: null,
      licenseeStats: [],
      tableReady: false,
    };
  }

  try {
    const licenseeStats = await prisma.ffttClubLicenseeStat.findMany({
      orderBy: [{ city: "asc" }, { clubName: "asc" }],
    });
    const licenseeTotal = licenseeStats.reduce(
      (total, stat) => total + stat.licenseeCount,
      0,
    );
    const lastSyncedAt =
      licenseeStats
        .map((stat) => stat.syncedAt)
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

    return {
      clubs,
      activeClubCount: activeClubs.length,
      ffttClubCount: clubsWithFfttId.length,
      cityCount: cities.length,
      licenseeTotal,
      syncedClubCount: licenseeStats.length,
      failedClubCount: licenseeStats.filter((stat) => Boolean(stat.syncError))
        .length,
      lastSyncedAt,
      licenseeStats,
      tableReady: true,
    };
  } catch (error) {
    if (isMissingTableError(error)) {
      return {
        clubs,
        activeClubCount: activeClubs.length,
        ffttClubCount: clubsWithFfttId.length,
        cityCount: cities.length,
        licenseeTotal: null,
        syncedClubCount: 0,
        failedClubCount: 0,
        lastSyncedAt: null,
        licenseeStats: [],
        tableReady: false,
      };
    }

    throw error;
  }
}

export async function getPublicLicenseeTotal() {
  if (!(await hasLicenseeStatsTable())) {
    return null;
  }

  try {
    const stats = await prisma.ffttClubLicenseeStat.findMany({
      select: { licenseeCount: true, syncError: true },
    });

    const successfulStats = stats.filter((stat) => !stat.syncError);

    if (successfulStats.length === 0) {
      return null;
    }

    return successfulStats.reduce(
      (total, stat) => total + stat.licenseeCount,
      0,
    );
  } catch (error) {
    if (isMissingTableError(error)) {
      return null;
    }

    throw error;
  }
}

export async function syncFfttLicenseeStats() {
  await requireAdminSession();

  if (!(await hasLicenseeStatsTable())) {
    redirect(
      `/admin/stats?error=${encodeMessage(
        "La table des statistiques n'existe pas encore. Lancez prisma db push.",
      )}`,
    );
  }

  const clubs = (await getAdminClubs()).filter(
    (club) => club.active && Boolean(club.ffttId),
  );

  if (clubs.length === 0) {
    redirect(
      `/admin/stats?error=${encodeMessage(
        "Aucun club actif avec identifiant FFTT. Synchronisez d'abord les clubs.",
      )}`,
    );
  }

  let syncedCount = 0;
  let failedCount = 0;

  try {
    for (const club of clubs) {
      if (!club.ffttId) {
        continue;
      }

      try {
        const licensees = await ffttClient.getLicenseesByClub(club.ffttId);

        await prisma.ffttClubLicenseeStat.upsert({
          where: { clubFfttId: club.ffttId },
          update: {
            clubName: club.name,
            city: club.city,
            licenseeCount: licensees.length,
            syncError: null,
            syncedAt: new Date(),
          },
          create: {
            clubFfttId: club.ffttId,
            clubName: club.name,
            city: club.city,
            licenseeCount: licensees.length,
            syncError: null,
            syncedAt: new Date(),
          },
        });

        syncedCount += 1;
      } catch (error) {
        failedCount += 1;

        await prisma.ffttClubLicenseeStat.upsert({
          where: { clubFfttId: club.ffttId },
          update: {
            clubName: club.name,
            city: club.city,
            licenseeCount: 0,
            syncError: serializeErrorMessage(error),
            syncedAt: new Date(),
          },
          create: {
            clubFfttId: club.ffttId,
            clubName: club.name,
            city: club.city,
            licenseeCount: 0,
            syncError: serializeErrorMessage(error),
            syncedAt: new Date(),
          },
        });
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/stats");
    revalidatePath("/");
  } catch (error) {
    redirect(`/admin/stats?error=${encodeMessage(serializeErrorMessage(error))}`);
  }

  redirect(`/admin/stats?synced=${syncedCount}&failed=${failedCount}`);
}
