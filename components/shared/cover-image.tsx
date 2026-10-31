import Image from "next/image";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CoverImageProps = {
  src?: string | null;
  sizes: string;
  fallbackIcon: LucideIcon;
  priority?: boolean;
  className?: string;
};

export function CoverImage({
  src,
  sizes,
  fallbackIcon: FallbackIcon,
  priority = false,
  className,
}: CoverImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden bg-muted",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div className="grid h-full place-items-center text-muted-foreground">
          <FallbackIcon aria-hidden="true" className="size-10" />
        </div>
      )}
    </div>
  );
}
