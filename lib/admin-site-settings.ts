"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import {
  affiliations,
  officeHours,
  partners,
  siteConfig,
  socialLinks,
} from "@/lib/site";

const SITE_SETTINGS_ID = 1;

function normalizeTextareaValue(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function getDefaultSettingsInput() {
  const [facebookLink, instagramLink] = socialLinks;

  return {
    id: SITE_SETTINGS_ID,
    siteName: siteConfig.name,
    shortName: siteConfig.shortName,
    description: siteConfig.description,
    season: siteConfig.season,
    email: siteConfig.email,
    phone: siteConfig.phone,
    organization: siteConfig.organization,
    publicationDirector: siteConfig.publicationDirector,
    dataContact: siteConfig.dataContact,
    addressLine1: siteConfig.addressLine1,
    addressLine2: siteConfig.addressLine2,
    postalCode: siteConfig.postalCode,
    city: siteConfig.city,
    officeHours: officeHours.join("\n"),
    affiliations: affiliations.join("\n"),
    partners: partners.join("\n"),
    facebookUrl: facebookLink?.href ?? "",
    instagramUrl: instagramLink?.href ?? "",
  };
}

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    update: {},
    create: getDefaultSettingsInput(),
  });
}

export async function updateSiteSettings(formData: FormData) {
  await prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    update: {
      siteName: String(formData.get("siteName") ?? "").trim(),
      shortName: String(formData.get("shortName") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      season: String(formData.get("season") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      organization: String(formData.get("organization") ?? "").trim(),
      publicationDirector: String(
        formData.get("publicationDirector") ?? "",
      ).trim(),
      dataContact: String(formData.get("dataContact") ?? "").trim(),
      addressLine1: String(formData.get("addressLine1") ?? "").trim(),
      addressLine2: String(formData.get("addressLine2") ?? "").trim(),
      postalCode: String(formData.get("postalCode") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      officeHours: normalizeTextareaValue(formData.get("officeHours")),
      affiliations: normalizeTextareaValue(formData.get("affiliations")),
      partners: normalizeTextareaValue(formData.get("partners")),
      facebookUrl: String(formData.get("facebookUrl") ?? "").trim(),
      instagramUrl: String(formData.get("instagramUrl") ?? "").trim(),
    },
    create: {
      ...getDefaultSettingsInput(),
      siteName: String(formData.get("siteName") ?? "").trim(),
      shortName: String(formData.get("shortName") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      season: String(formData.get("season") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      organization: String(formData.get("organization") ?? "").trim(),
      publicationDirector: String(
        formData.get("publicationDirector") ?? "",
      ).trim(),
      dataContact: String(formData.get("dataContact") ?? "").trim(),
      addressLine1: String(formData.get("addressLine1") ?? "").trim(),
      addressLine2: String(formData.get("addressLine2") ?? "").trim(),
      postalCode: String(formData.get("postalCode") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      officeHours: normalizeTextareaValue(formData.get("officeHours")),
      affiliations: normalizeTextareaValue(formData.get("affiliations")),
      partners: normalizeTextareaValue(formData.get("partners")),
      facebookUrl: String(formData.get("facebookUrl") ?? "").trim(),
      instagramUrl: String(formData.get("instagramUrl") ?? "").trim(),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/site");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/mentions-legales");
  revalidatePath("/politique-confidentialite");
  redirect("/admin/site?updated=1");
}
