"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NAV_ITEMS } from "@/constants";
import CreateWorkspacesModal from "@/features/workspaces/components/create-workspaces-modal";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProjectsNavigation from "./projects-navigation";
import { Separator } from "./ui/separator";
import CreateProjectModal from "@/features/projects/components/create-project-modal";
import Image from "next/image";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const workspaceId = useGetWorkspaceIdParam();
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <CreateWorkspacesModal />
      <CreateProjectModal />
      <SidebarHeader className="pt-4 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href={`/workspaces/${workspaceId}`}
              className="flex items-center gap-x-2"
            >
              <Image
                src={"/icons/icon.png"}
                alt="icon"
                width={30}
                height={30}
              />
              <span className="text-lg font-semibold text-muted-foreground hover:text-black transition-colors">
                TaskPilot
              </span>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem className="pt-4">
            <WorkspaceSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="space-y-4">
            <SidebarMenu>
              {NAV_ITEMS.map(({ name, link, icon: Icon }) => {
                const fullHrefPath = `/workspaces/${workspaceId}${link}`;
                const isActive = pathname === fullHrefPath;

                return (
                  <SidebarMenuItem key={name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={fullHrefPath}>
                        <Icon /> {name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            <Separator />
            <ProjectsNavigation />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
