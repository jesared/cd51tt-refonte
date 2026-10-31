import { Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type IllustratedEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  headingLevel?: "h2" | "h3";
  className?: string;
};

export function IllustratedEmptyState({
  icon: Icon,
  title,
  description,
  headingLevel = "h2",
  className,
}: IllustratedEmptyStateProps) {
  const Heading = headingLevel;

  return (
    <div
      role="status"
      className={`rounded-xl border border-dashed border-border bg-card/70 px-6 py-10 text-center ${className ?? ""}`}
    >
      <div
        aria-hidden="true"
        className="relative mx-auto grid size-20 place-items-center rounded-3xl border border-primary/20 bg-primary/5 text-primary before:absolute before:inset-2 before:rounded-full before:border before:border-primary/15"
      >
        <Icon className="relative size-9" />
        <span className="absolute -right-2 -top-2 grid size-8 place-items-center rounded-full border border-border bg-background text-amber-500 shadow-sm">
          <Sparkles className="size-4" />
        </span>
      </div>
      <Heading className="mt-5 text-lg font-semibold tracking-tight">
        {title}
      </Heading>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
