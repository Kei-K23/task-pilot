import {
  Circle,
  CircleCheck,
  CircleDot,
  CircleDotDashed,
  CircleEllipsis,
  Plus,
} from "lucide-react";
import { TASK_STATUS } from "../type";
import { formatEnumCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useOpenCreateTaskModal } from "../hooks/use-open-create-task-modal";

interface TaskKanbanHeaderProps {
  board: TASK_STATUS;
  tasksCount: number;
}

const statusToIconMap: Record<TASK_STATUS, React.ReactNode> = {
  [TASK_STATUS.BACKLOG]: <Circle className="size-5 text-pink-400" />,
  [TASK_STATUS.TODO]: <CircleDotDashed className="size-5 text-red-400" />,
  [TASK_STATUS.IN_PROGRESS]: (
    <CircleEllipsis className="size-5 text-yellow-400" />
  ),
  [TASK_STATUS.IN_REVIEW]: <CircleDot className="size-5 text-blue-400" />,
  [TASK_STATUS.DONE]: <CircleCheck className="size-5 text-emerald-400" />,
};

export default function TaskKanbanHeader({
  board,
  tasksCount,
}: TaskKanbanHeaderProps) {
  const { open: openCreateTaskModal, setIsOpen } = useOpenCreateTaskModal();
  const icon = statusToIconMap[board];

  return (
    <div className="flex items-center justify-between gap-x-8 bg-muted px-3 rounded-lg">
      <div className="flex items-center gap-x-2">
        {icon}
        <span>{formatEnumCase(board)}</span>
        <span className="bg-gray-200 dark:bg-gray-800 px-2 rounded-lg text-muted-foreground text-sm">
          {tasksCount}
        </span>
      </div>
      <Button
        onClick={() => {
          openCreateTaskModal();
          setIsOpen({
            initialTaskStatus: board,
          });
        }}
        size={"icon"}
        variant={"ghost"}
      >
        <Plus />
      </Button>
    </div>
  );
}
