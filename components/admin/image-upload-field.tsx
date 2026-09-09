"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;

type ImageUploadFieldProps = {
  initialImageUrl?: string | null;
  imageUrlName?: string;
  imageUploadName?: string;
  removeImageName?: string;
};

function isValidImageUrl(value: string) {
  return !value || value.startsWith("/") || URL.canParse(value);
}

function getFilePreviewUrl(file: File | null) {
  if (!file || !file.type.startsWith("image/")) {
    return null;
  }

  return URL.createObjectURL(file);
}

export function ImageUploadField({
  initialImageUrl,
  imageUrlName = "imageUrl",
  imageUploadName = "imageUpload",
  removeImageName = "removeImage",
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(initialImageUrl ?? "");
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const urlIsValid = isValidImageUrl(imageUrl);
  const visiblePreviewUrl = useMemo(() => {
    if (filePreviewUrl) {
      return filePreviewUrl;
    }

    if (!removeImage && urlIsValid && imageUrl) {
      return imageUrl;
    }

    return null;
  }, [filePreviewUrl, imageUrl, removeImage, urlIsValid]);

  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px] lg:items-start">
      <div className="grid gap-2">
        <label htmlFor={imageUrlName} className="text-sm font-medium">
          Image existante
        </label>
        <input
          id={imageUrlName}
          name={imageUrlName}
          value={imageUrl}
          onChange={(event) => {
            setImageUrl(event.target.value);
            setRemoveImage(false);
          }}
          placeholder="https://... ou /images/competition.jpg"
          aria-invalid={!urlIsValid}
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20"
        />
        <p className="text-xs leading-5 text-muted-foreground">
          Collez une URL complète ou un chemin interne commençant par /.
        </p>
        {!urlIsValid ? (
          <p className="text-xs leading-5 text-destructive">
            Le lien de l’image n’est pas valide.
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor={imageUploadName} className="text-sm font-medium">
          Image Cloudinary
        </label>
        <input
          ref={fileInputRef}
          id={imageUploadName}
          name={imageUploadName}
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;

            if (filePreviewUrl) {
              URL.revokeObjectURL(filePreviewUrl);
              setFilePreviewUrl(null);
            }

            if (!file) {
              setFileError(null);
              return;
            }

            if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_SIZE) {
              setFileError(
                "Choisissez une image JPG, PNG ou WebP de moins de 15 Mo.",
              );
              event.target.value = "";
              return;
            }

            setFileError(null);
            setRemoveImage(false);
            setFilePreviewUrl(getFilePreviewUrl(file));
          }}
          className="h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm file:text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
        <p className="text-xs leading-5 text-muted-foreground">
          Taille conseillée : 1600 x 900 px minimum, image nette, moins de 15 Mo.
        </p>
        {fileError ? (
          <p className="text-xs leading-5 text-destructive">{fileError}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl border border-border bg-muted text-muted-foreground">
          {visiblePreviewUrl ? (
            <Image
              src={visiblePreviewUrl}
              alt=""
              fill
              unoptimized
              sizes="220px"
              className="object-cover"
            />
          ) : (
            <ImageIcon className="size-8" />
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            if (filePreviewUrl) {
              URL.revokeObjectURL(filePreviewUrl);
              setFilePreviewUrl(null);
            }

            setImageUrl("");
            setFileError(null);
            setRemoveImage(true);

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Trash2 className="size-4" />
          Supprimer l’image
        </button>
        <input
          type="hidden"
          name={removeImageName}
          value={removeImage ? "on" : ""}
        />
        <p className="flex items-center gap-2 text-xs leading-5 text-muted-foreground">
          <Upload className="size-3.5" />
          L’aperçu se met à jour avant l’enregistrement.
        </p>
      </div>
    </div>
  );
}
