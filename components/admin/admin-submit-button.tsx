"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loadingLabel?: string;
  icon?: ReactNode;
  variant?: "default" | "outline" | "danger";
};

export function AdminSubmitButton({
  children,
  loadingLabel = "Traitement...",
  icon,
  variant = "outline",
  className,
  disabled,
  ...props
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={cn(
        "admin-action",
        variant === "default" && "admin-action-primary",
        variant === "danger" && "admin-action-danger",
        pending && "is-loading",
        className,
      )}
      disabled={disabled || pending}
      aria-busy={pending}
      {...props}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        icon
      )}
      <span>{pending ? loadingLabel : children}</span>
    </button>
  );
}
