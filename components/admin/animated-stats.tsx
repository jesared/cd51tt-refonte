"use client";

import {
  ArrowUpRight,
  Building2,
  Clock3,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";

type KpiTone = "licensees" | "average" | "clubs" | "sync";

type KpiItem = {
  label: string;
  value: number | null;
  textValue?: string;
  description: string;
  tone: KpiTone;
};

type BarItem = {
  id: string;
  label: string;
  caption?: string;
  value: number;
  prefix?: string;
};

type AnimatedKpiGridProps = {
  items: KpiItem[];
};

type AnimatedBarListProps = {
  rows: BarItem[];
  emptyLabel: string;
  barTone?: "primary" | "foreground";
};

const kpiIcons: Record<KpiTone, LucideIcon> = {
  licensees: Users,
  average: ArrowUpRight,
  clubs: Building2,
  sync: Clock3,
};

function easeOutQuart(progress: number) {
  return 1 - Math.pow(1 - progress, 4);
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReducedMotion(query.matches);

    const handleChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", handleChange);

    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reducedMotion;
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || reducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -16% 0px", threshold: 0.25 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [reducedMotion]);

  return { ref, isVisible, reducedMotion };
}

function AnimatedValue({
  value,
  active,
  reducedMotion,
}: {
  value: number;
  active: boolean;
  reducedMotion: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(reducedMotion ? value : 0);
  const formatter = useMemo(() => new Intl.NumberFormat("fr-FR"), []);

  useEffect(() => {
    if (!active || reducedMotion) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    let start: number | null = null;
    const duration = 1200;

    const tick = (time: number) => {
      start ??= time;
      const progress = Math.min((time - start) / duration, 1);
      const eased = easeOutQuart(progress);

      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [active, reducedMotion, value]);

  return <>{formatter.format(displayValue)}</>;
}

export function AnimatedKpiGrid({ items }: AnimatedKpiGridProps) {
  const { ref, isVisible, reducedMotion } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      data-visible={isVisible}
      className="group/admin-kpis grid gap-3 md:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item, index) => {
        const Icon = kpiIcons[item.tone];
        const style = {
          animationDelay: `${index * 90}ms`,
        } satisfies CSSProperties;

        return (
          <div
            key={item.label}
            className="admin-kpi-card rounded-lg border border-border bg-background p-5 opacity-0 shadow-sm group-data-[visible=true]/admin-kpis:animate-[admin-kpi_620ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
            style={style}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <Icon className="size-4 text-primary" />
            </div>
            <p className="mt-3 text-3xl font-semibold tabular-nums">
              {item.value === null ? (
                item.textValue ?? "-"
              ) : (
                <AnimatedValue
                  value={item.value}
                  active={isVisible}
                  reducedMotion={reducedMotion}
                />
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.description}
            </p>
          </div>
        );
      })}
    </section>
  );
}

export function AnimatedBarList({
  rows,
  emptyLabel,
  barTone = "primary",
}: AnimatedBarListProps) {
  const { ref, isVisible, reducedMotion } = useInView<HTMLDivElement>();
  const maxValue = rows.reduce((max, row) => Math.max(max, row.value), 0);
  const barColor = barTone === "primary" ? "bg-primary" : "bg-foreground";

  if (rows.length === 0) {
    return (
      <div className="px-5 py-8 text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div ref={ref} className="space-y-4 p-5">
      {rows.map((row, index) => {
        const percent =
          maxValue <= 0 ? 0 : Math.max(4, Math.round((row.value / maxValue) * 100));
        const style = {
          transitionDelay: reducedMotion ? "0ms" : `${index * 85}ms`,
          transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
          width: isVisible ? `${percent}%` : "0%",
        } satisfies CSSProperties;

        return (
          <div key={row.id} className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="flex min-w-0 items-center gap-3">
                {row.prefix ? (
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                    {row.prefix}
                  </span>
                ) : null}
                <div className="min-w-0">
                  <p className="truncate font-medium">{row.label}</p>
                  {row.caption ? (
                    <p className="text-xs text-muted-foreground">
                      {row.caption}
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="shrink-0 font-medium tabular-nums">
                <AnimatedValue
                  value={row.value}
                  active={isVisible}
                  reducedMotion={reducedMotion}
                />
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${barColor} transition-[width] duration-1000`}
                style={style}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
