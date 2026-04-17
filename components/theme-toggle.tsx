"use client";

import { useEffect, useState } from "react";
import { Monitor, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Clair", icon: SunMedium },
  { value: "dark", label: "Sombre", icon: MoonStar },
  { value: "system", label: "Système", icon: Monitor },
] as const;

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme ?? "system" : "system";
  const ActiveIcon =
    mounted && resolvedTheme === "dark" ? MoonStar : SunMedium;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Changer de thème"
        className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }))}
      >
        <ActiveIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Apparence</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {themeOptions.map((option) => {
            const Icon = option.icon;

            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setTheme(option.value)}
                className="justify-between"
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {option.label}
                </span>
                {activeTheme === option.value ? (
                  <span className="text-xs text-muted-foreground">Actif</span>
                ) : null}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
