export const OFFICIAL_FACEBOOK_URL = "https://www.facebook.com/cd51tt";

export function getFacebookShareUrl(url: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url,
  )}`;
}

export function normalizeFacebookUrl(url: string | null | undefined) {
  const value = url?.trim();

  if (!value || value === "https://www.facebook.com/") {
    return OFFICIAL_FACEBOOK_URL;
  }

  return value;
}
