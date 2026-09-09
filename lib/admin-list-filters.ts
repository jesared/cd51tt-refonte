export const RECENT_UPDATE_DAYS = 30;

export function getRecentUpdateThreshold() {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - RECENT_UPDATE_DAYS);
  threshold.setHours(0, 0, 0, 0);

  return threshold;
}

export function matchesRecentUpdateFilter(
  updatedAt: Date,
  filter: string | undefined,
  threshold = getRecentUpdateThreshold(),
) {
  if (filter === "recent") {
    return updatedAt >= threshold;
  }

  if (filter === "older") {
    return updatedAt < threshold;
  }

  return true;
}
