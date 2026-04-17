import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
  className,
}: SectionCardProps) {
  return (
    <Card
      className={cn(
        "surface-panel py-0 shadow-none",
        className,
      )}
    >
      <CardHeader className="border-b border-border px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            {eyebrow ? (
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}
            <CardTitle className="text-lg text-balance">{title}</CardTitle>
            {description ? (
              <CardDescription className="max-w-2xl text-sm leading-6">
                {description}
              </CardDescription>
            ) : null}
          </div>
          {Icon ? (
            <div className="rounded-2xl border border-border bg-muted p-3 text-primary">
              <Icon className="size-5" />
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="px-6 py-5">{children}</CardContent>
    </Card>
  );
}
