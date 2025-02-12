import DotdotSeparator from "@/components/dotdot-separator";
import { Task } from "../type";
import TaskAction from "./task-action";
import MemberAvatar from "@/features/members/components/member-avatar";
import TaskDate from "./task-date";
import ProjectAvatar from "@/features/projects/components/project-avatar";

interface TaskKanbanItemProps {
  task: Task;
}

export default function TaskKanbanItem({ task }: TaskKanbanItemProps) {
  return (
    <div className="bg-white pt-2 pb-3 px-2 rounded-md">
      <div className="flex items-center justify-between gap-x-1">
        <span className="text-base">{task.name}</span>
        <TaskAction task={task} />
      </div>
      <div className="my-2">
        <DotdotSeparator />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-x-2">
          <MemberAvatar
            name={task.assignee.name}
            color={task.assignee.color}
            className="size-8"
          />
          <div>
            <span className="text-sm">{task.assignee.name}</span>
            <TaskDate dueDate={task.dueDate} className="text-xs" />
          </div>
        </div>
        <div>
          <ProjectAvatar
            name={task.project.name}
            imageUrl={task.project.color}
            className="size-8"
            textClassName="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
