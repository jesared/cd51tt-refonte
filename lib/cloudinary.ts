import "server-only";

import crypto from "node:crypto";
import path from "node:path";

import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";

const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;

type UploadTarget = "image" | "document";

function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryUrl: process.env.CLOUDINARY_URL,
  };
}

export function isCloudinaryConfigured() {
  const config = getCloudinaryConfig();

  return Boolean(
    config.cloudinaryUrl ||
      (config.cloudName && config.apiKey && config.apiSecret),
  );
}

function configureCloudinary() {
  const config = getCloudinaryConfig();

  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary n'est pas configuré. Ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans .env.",
    );
  }

  if (config.cloudinaryUrl) {
    cloudinary.config({ secure: true });
    return;
  }

  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });
}

function isProvidedFile(file: File | null) {
  return Boolean(file && file.size > 0 && file.name);
}

function sanitizePublicIdPart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildRawPublicId(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, extension);
  const safeBaseName = sanitizePublicIdPart(baseName) || "document";
  const safeExtension = extension.replace(/[^a-z0-9.]/g, "");
  const uniqueSuffix = crypto.randomUUID().slice(0, 8);

  return `cd51tt/documents/${safeBaseName}-${uniqueSuffix}${safeExtension}`;
}

export async function uploadFileToCloudinary(
  file: File | null,
  target: UploadTarget,
) {
  if (!isProvidedFile(file)) {
    return null;
  }

  if (!file) {
    return null;
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Le fichier dépasse la limite de 15 Mo.");
  }

  configureCloudinary();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const options: UploadApiOptions =
    target === "image"
      ? {
          folder: "cd51tt/images",
          resource_type: "image",
          use_filename: true,
          unique_filename: true,
          overwrite: false,
        }
      : {
          public_id: buildRawPublicId(file.name),
          resource_type: "raw",
          overwrite: false,
        };

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary n'a pas retourne d'URL."));
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.end(buffer);
  });
}
