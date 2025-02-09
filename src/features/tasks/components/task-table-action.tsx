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
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { useDeleteTask } from "../api/use-delete-task";
import { toast } from "sonner";
import { useOpenEditTaskModal } from "../hooks/use-open-edit-task-modal";

interface TaskTableActionProps {
  task: Task;
}

export default function TaskTableAction({ task }: TaskTableActionProps) {
  const workspaceId = useGetWorkspaceParam();
  const { setIsOpen } = useOpenEditTaskModal();
  const [DeleteConfirmDialog, deleteConfirm] = useConfirmDialog(
    "Are you sure?",
    "This process cannot be undo"
  );
  const { mutate: deleteMutation } = useDeleteTask({ workspaceId });

  const handleDelete = async () => {
    const ok = await deleteConfirm();

    if (!ok) {
      return;
    }

    deleteMutation(
      { param: { taskId: task.$id }, query: { workspaceId } },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      }
    );
  };

  return (
    <>
      <DeleteConfirmDialog />
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
          <DropdownMenuItem
            onClick={() => {
              setIsOpen({
                editTaskForm: true,
                taskId: task.$id,
              });
            }}
          >
            <Pencil /> Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="flex items-center justify-center bg-red-500 text-white focus:bg-red-500/80 focus:text-white cursor-pointer"
          >
            <Trash2 /> Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
