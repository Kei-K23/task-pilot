import { Plus } from "lucide-react";
import { SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { useCreateProject } from "@/features/projects/hooks/use-create-project";
import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";

export default function ProjectsNavigation() {
  const { open: openCreateProject } = useCreateProject();
  const workspaceId = useGetWorkspaceParam();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="px-2 flex items-center justify-between mb-1">
          <span className="text-[11px] text-muted-foreground">PROJECTS</span>
          <Plus
            onClick={openCreateProject}
            className="size-4 p-0.5 bg-neutral-500 hover:bg-neutral-500/80 cursor-pointer transition-all text-white rounded-full"
          />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
