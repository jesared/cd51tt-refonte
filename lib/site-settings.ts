import "server-only";

import { cache } from "react";

import { prisma } from "@/lib/prisma";
import {
  affiliations,
  officeHours,
  partners,
  quickContactLinks,
  siteConfig,
  socialLinks,
} from "@/lib/site";

const SITE_SETTINGS_ID = 1;

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildMailto(email: string) {
  return `mailto:${email}`;
}

export type PublicSiteSettings = {
  siteConfig: typeof siteConfig;
  officeHours: string[];
  affiliations: string[];
  partners: string[];
  quickContactLinks: typeof quickContactLinks;
  socialLinks: typeof socialLinks;
};

export function getDefaultPublicSiteSettings(): PublicSiteSettings {
  return {
    siteConfig,
    officeHours,
    affiliations,
    partners,
    quickContactLinks: [
      {
        href: buildMailto(siteConfig.email),
        label: "Écrire au comité",
      },
    ],
    socialLinks,
  };
}

export const getPublicSiteSettings = cache(async () => {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: SITE_SETTINGS_ID },
    });

    if (!settings) {
      return getDefaultPublicSiteSettings();
    }

    const nextSiteConfig = {
      ...siteConfig,
      name: settings.siteName,
      shortName: settings.shortName,
      description: settings.description,
      addressLine1: settings.addressLine1,
      addressLine2: settings.addressLine2,
      postalCode: settings.postalCode,
      city: settings.city,
      location: `${settings.addressLine1}, ${settings.city}`,
      season: settings.season,
      email: settings.email,
      phone: settings.phone,
      organization: settings.organization,
      publicationDirector: settings.publicationDirector,
      dataContact: settings.dataContact,
    };

    return {
      siteConfig: nextSiteConfig,
      officeHours: splitLines(settings.officeHours),
      affiliations: splitLines(settings.affiliations),
      partners: splitLines(settings.partners),
      quickContactLinks: [
        {
          href: buildMailto(settings.email),
          label: "Écrire au comité",
        },
      ],
      socialLinks: [
        { href: settings.facebookUrl, label: "Facebook" },
        { href: settings.instagramUrl, label: "Instagram" },
      ].filter((link) => link.href),
    } satisfies PublicSiteSettings;
  } catch {
    return getDefaultPublicSiteSettings();
  }
});
