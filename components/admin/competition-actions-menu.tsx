"use client";

import { EyeOff, MoreVertical, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CompetitionActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Ouvrir les actions"
        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition duration-200 ease-out hover:border-primary/35 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <Pencil className="size-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <EyeOff className="size-4" />
            Dépublier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled variant="destructive">
            <Trash2 className="size-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
