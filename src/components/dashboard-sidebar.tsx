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
import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const workspaceId = useGetWorkspaceParam();
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <CreateWorkspacesModal />
      <SidebarHeader className="pt-4 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/"} className="flex items-center gap-x-2">
              <RefreshCcw />
              WorkSync
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem className="pt-4">
            <WorkspaceSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ name, link, icon: Icon }) => {
                const fullHrefPath = `/workspaces/${workspaceId}${link}`;
                const isActive = pathname === fullHrefPath;
                console.log(fullHrefPath);

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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
