"use client";

import { Folder, Plus } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useOpenCreateProjectModal } from "@/features/projects/hooks/use-open-create-project-modal";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function ProjectsNavigation() {
  const workspaceId = useGetWorkspaceIdParam();
  const { data, isLoading } = useGetProjects({ workspaceId });
  const { open: openCreateProjectModal } = useOpenCreateProjectModal();
  const pathname = usePathname();

  return (
    <SidebarMenu>
      <div className="px-2 flex items-center justify-between mb-1">
        <span className="text-[11px] text-muted-foreground">PROJECTS</span>
        <Plus
          onClick={openCreateProjectModal}
          className="size-4 p-0.5 bg-neutral-500 hover:bg-neutral-500/80  cursor-pointer transition-all text-white rounded-full"
        />
      </div>
      <div className="space-y-1">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="w-full h-[30px] flex items-center gap-x-2">
              <Skeleton className="bg-neutral-200 dark:bg-neutral-700 w-[35px] h-full" />
              <Skeleton className="bg-neutral-200 dark:bg-neutral-700 flex-1 w-full h-full" />
            </div>
          ))
        ) : data?.total === 0 ? (
          <div className="text-muted-foreground flex items-center justify-center gap-x-1">
            <span>No project create yet!</span>{" "}
            <Folder className="size-4 text-muted-foreground" />
          </div>
        ) : (
          data?.documents.map((project) => {
            const fullHrefPath = `/workspaces/${workspaceId}/projects/${project.$id}`;
            const isActive = pathname === fullHrefPath;

            return (
              <SidebarMenuItem key={project.$id}>
                <SidebarMenuButton asChild isActive={isActive} className="h-10">
                  <Link href={fullHrefPath}>
                    <div className="flex items-center gap-x-2">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarImage
                          src={project?.imageUrl}
                          alt="Project logo"
                        />
                        <AvatarFallback className="bg-primary text-white rounded-lg font-bold text-lg">
                          {project?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{project.name}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })
        )}
      </div>
    </SidebarMenu>
  );
}
