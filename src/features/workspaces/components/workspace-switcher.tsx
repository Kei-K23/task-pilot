"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function WorkspaceSwitcher() {
  const { data } = useGetWorkspaces();
  //! TODO: Find a way to inter the type that come from App Write
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedValue, setSelectedValue] = useState<null | any>(null);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus:outline-none ring-neutral-200"
            >
              {selectedValue ? (
                <div className="flex items-center justify-center gap-x-2">
                  <div className="aspect-square size-10 rounded-lg">
                    <Avatar className="w-full h-full rounded-lg">
                      <AvatarImage
                        src={selectedValue?.imageUrl}
                        alt="Workspace logo"
                      />
                      <AvatarFallback className="bg-black text-white rounded-lg font-bold text-lg">
                        {selectedValue?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">{selectedValue?.name}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5 leading-none">
                  <span>No workspace selected</span>
                </div>
              )}
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {data?.documents.map((workspace) => (
              <DropdownMenuItem
                key={workspace.$id}
                onSelect={() => setSelectedValue(workspace)}
              >
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg">
                  <Avatar className="w-full h-full rounded-lg">
                    <AvatarImage
                      src={workspace?.imageUrl}
                      alt="Workspace logo"
                    />
                    <AvatarFallback className="bg-black text-white rounded-lg font-bold text-lg">
                      {workspace?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{workspace?.name}</span>
                </div>
                {workspace.$id === selectedValue?.$id && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
