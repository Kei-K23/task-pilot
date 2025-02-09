import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Task } from "../type";
import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import Link from "next/link";

interface TaskTableActionProps {
  task: Task;
}

export default function TaskTableAction({ task }: TaskTableActionProps) {
  const workspaceId = useGetWorkspaceParam();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:ring-0">
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link
          href={`/workspaces/${workspaceId}/projects/${task.projectId}/tasks/${task.$id}`}
        >
          <DropdownMenuItem>
            <ExternalLink />
            Task Detail
          </DropdownMenuItem>
        </Link>
        <Link href={`/workspaces/${workspaceId}/projects/${task.projectId}`}>
          <DropdownMenuItem>
            <ExternalLink /> Open Project
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <Pencil /> Edit Task
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center justify-center bg-red-500 text-white focus:bg-red-500/80 focus:text-white cursor-pointer">
          <Trash2 /> Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
