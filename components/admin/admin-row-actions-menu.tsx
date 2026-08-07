"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { DeleteConfirmationForm } from "@/components/admin/delete-confirmation-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AdminRowActionsMenuProps = {
  children?: ReactNode;
  editHref: string;
  deleteAction: (formData: FormData) => void | Promise<void>;
  deleteId: string;
  deleteFields?: Record<string, string>;
  deleteMessage: string;
};

export function AdminRowActionsMenu({
  children,
  editHref,
  deleteAction,
  deleteFields,
  deleteId,
  deleteMessage,
}: AdminRowActionsMenuProps) {
  const hiddenFields = deleteFields ?? { id: deleteId };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Ouvrir les actions"
        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition duration-200 ease-out hover:border-primary/35 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          {children ? (
            <>
              {children}
              <DropdownMenuSeparator />
            </>
          ) : null}
          <DropdownMenuItem className="p-0">
            <Link
              href={editHref}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm"
            >
              <Pencil className="size-4" />
              Modifier
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="px-1">
            <DeleteConfirmationForm
              action={deleteAction}
              message={deleteMessage}
            >
              {Object.entries(hiddenFields).map(([name, value]) => (
                <input key={name} type="hidden" name={name} value={value} />
              ))}
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
                Supprimer
              </button>
            </DeleteConfirmationForm>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
