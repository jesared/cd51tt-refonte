"use client";

import { Building2, MapPinned, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";

type AnimatedMetric = {
  label: string;
  value: number;
  tone: "clubs" | "cities" | "licensees";
};

type AnimatedMetricsProps = {
  metrics: AnimatedMetric[];
};

const metricIcons: Record<AnimatedMetric["tone"], LucideIcon> = {
  clubs: Building2,
  cities: MapPinned,
  licensees: Users,
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

function AnimatedNumber({
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
    const duration = 1400;

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

export function AnimatedMetrics({ metrics }: AnimatedMetricsProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || reducedMotion) {
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
      { rootMargin: "0px 0px -20% 0px", threshold: 0.32 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Chiffres clés"
      data-visible={isVisible}
      className="group/metrics grid gap-4 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {metrics.map((metric, index) => {
        const Icon = metricIcons[metric.tone];
        const delay = index * 150;
        const cardStyle = {
          animationDelay: `${delay}ms`,
          "--metric-delay": `${delay}ms`,
        } as CSSProperties;

        return (
          <div
            key={metric.label}
            className="metric-card group relative overflow-hidden rounded-lg border border-border bg-card p-5 opacity-0 shadow-sm transition-colors hover:border-primary/35 group-data-[visible=true]/metrics:animate-[metric-card_820ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
            style={cardStyle}
          >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary/80 group-data-[visible=true]/metrics:animate-[metric-progress_1400ms_cubic-bezier(0.25,1,0.5,1)_forwards]" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-4xl font-semibold tracking-tight tabular-nums">
                  <AnimatedNumber
                    value={metric.value}
                    active={isVisible}
                    reducedMotion={reducedMotion}
                  />
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {metric.label}
                </p>
              </div>
              <div className="rounded-md border border-border bg-background p-3 text-primary opacity-0 transition-colors group-hover:bg-muted group-data-[visible=true]/metrics:animate-[metric-icon_720ms_cubic-bezier(0.22,1,0.36,1)_forwards]">
                <Icon className="size-5" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
