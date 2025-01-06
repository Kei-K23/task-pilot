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
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
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
        {/* We create a SidebarGroup for each parent. */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ name, link, icon: Icon }) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton asChild isActive={link === pathname}>
                    <Link href={link}>
                      <Icon /> {name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
