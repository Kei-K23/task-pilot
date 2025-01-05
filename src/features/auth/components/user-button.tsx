"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrent } from "../api/use-current";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useLogout } from "../api/use-logout";

export default function UserButton() {
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout, isPending } = useLogout();

  if (isLoading) {
    return (
      <Skeleton className="size-10 rounded-full bg-neutral-300 hover:opacity-75 transition-all" />
    );
  }

  if (!user) {
    return null;
  }

  const { email, name } = user;
  const fallbackName =
    name?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-10 border border-neutral-300 transition-all hover:opacity-75 cursor-pointer">
          <AvatarFallback className="bg-neutral-200 font-medium">
            {fallbackName}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex items-center justify-center flex-col">
          <Avatar className="size-14 border border-neutral-300 transition-all hover:opacity-75 cursor-pointer">
            <AvatarFallback className="bg-neutral-200 font-medium text-2xl">
              {fallbackName}
            </AvatarFallback>
          </Avatar>
          <span className="mt-2">{name}</span>
          <span className="text-sm text-muted-foreground">{email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          disabled={isPending}
          className="flex items-center justify-center bg-red-500 text-white focus:bg-red-500/80 focus:text-white cursor-pointer"
        >
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
