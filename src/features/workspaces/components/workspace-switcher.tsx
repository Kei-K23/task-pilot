"use client";

import { Plus } from "lucide-react";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetWorkspaceParam } from "../hooks/use-get-workspace-param";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateWorkspace } from "../hooks/use-create-workspace";
import { useRouter } from "next/navigation";

export function WorkspaceSwitcher() {
  const router = useRouter();
  const { open: openCreateWorkspace } = useCreateWorkspace();
  const workspaceId = useGetWorkspaceParam();
  const { data, isPending } = useGetWorkspaces();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-muted-foreground">WORKSPACE</span>
          <Plus
            onClick={openCreateWorkspace}
            className="size-4 p-0.5 bg-neutral-500 hover:bg-neutral-500/80 cursor-pointer transition-all text-white rounded-full"
          />
        </div>
        <Select
          value={workspaceId}
          onValueChange={(e) => {
            router.push(`/workspaces/${e}`);
          }}
        >
          <SelectTrigger className="focus-visible:right-0 focus-visible:ring-neutral-200">
            {isPending ? (
              <div className="animate-pulse text-muted-foreground flex items-center gap-x-1">
                Loading...
              </div>
            ) : (
              <SelectValue placeholder={"No workspace selected"} />
            )}
          </SelectTrigger>
          <SelectContent>
            {data?.documents.map((workspace) => (
              <SelectItem key={workspace.$id} value={workspace.$id}>
                <div className="flex items-center gap-x-2">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage
                      src={workspace?.imageUrl}
                      alt="Workspace logo"
                    />
                    <AvatarFallback className="bg-black text-white rounded-lg font-bold text-lg">
                      {workspace?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{workspace?.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
