import { Project } from "@/features/projects/type";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Task } from "../type";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "../api/use-delete-task";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { toast } from "sonner";
import { useOpenEditTaskModal } from "../hooks/use-open-edit-task-modal";
import EditTaskModal from "./edit-task-modal";
import { useRouter } from "next/navigation";

interface TaskBreadcrumbsProps {
  task: Task;
  project: Project;
}

export default function TaskBreadcrumbs({
  task,
  project,
}: TaskBreadcrumbsProps) {
  const router = useRouter();
  const { setIsOpen: setOpenEditTaskModal } = useOpenEditTaskModal();
  const [DeleteConfirmDialog, deleteConfirm] = useConfirmDialog(
    "Are you sure?",
    "This process cannot be undo"
  );
  const { mutate: deleteMutation } = useDeleteTask({
    workspaceId: task.workspaceId,
  });

  const handleDelete = async () => {
    const ok = await deleteConfirm();

    if (!ok) {
      return;
    }

    deleteMutation(
      { param: { taskId: task.$id }, query: { workspaceId: task.workspaceId } },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          router.push(`/workspaces/${task.workspaceId}/tasks`);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      }
    );
  };

  return (
    <>
      <EditTaskModal />
      <DeleteConfirmDialog />
      <div className="flex items-center justify-between gap-x-1">
        <div className="flex items-center gap-x-1">
          <Link
            href={`/workspaces/${task.workspaceId}/projects/${task.projectId}`}
            className="group "
          >
            <ProjectAvatar
              name={project.name}
              imageUrl={project.imageUrl}
              className="size-8"
              textClassName="text-[14px] text-muted-foreground group-hover:text-black transition-colors"
            />
          </Link>
          <ChevronRight className="size-6 text-muted-foreground" />
          <span className="font-bold text-base">{task.name}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              setOpenEditTaskModal({
                editTaskForm: true,
                taskId: task.$id,
              });
            }}
          >
            <Pencil className="hidden md:block" />
            <span className="text-sm font-bold">Edit</span>
          </Button>
          <Button variant={"destructive"} size={"sm"} onClick={handleDelete}>
            <Trash2 className="hidden md:block" />
            <span className="text-sm font-bold">Delete</span>
          </Button>
        </div>
      </div>
    </>
  );
}
