import { cn } from "@/lib/utils";
import { TASK_STATUS, TaskCalendarEventCard } from "../type";
import MemberAvatar from "@/features/members/components/member-avatar";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import Link from "next/link";

interface TaskCalendarEventCardItemProps {
  event: TaskCalendarEventCard;
}

const statusColorMap = {
  [TASK_STATUS.BACKLOG]: "border-pink-500",
  [TASK_STATUS.TODO]: "border-red-400",
  [TASK_STATUS.IN_PROGRESS]: "border-yellow-400",
  [TASK_STATUS.IN_REVIEW]: "border-blue-400",
  [TASK_STATUS.DONE]: "border-emerald-400",
};

export default function TaskCalendarEventCardItem({
  event,
}: TaskCalendarEventCardItemProps) {
  return (
    <Link href={`/workspaces/${event.project.workspaceId}/tasks/${event.$id}`}>
      <div
        className={cn(
          "mx-1 p-2 border-l-4 mb-3 bg-muted rounded-sm",
          statusColorMap[event.status]
        )}
      >
        <p className="text-sm">{event.title}</p>
        <div className="mt-2 flex items-center gap-x-2">
          <MemberAvatar
            name={event.assignee.name}
            color={event.assignee.color}
            className="size-7"
          />
          <ProjectAvatar
            name={event.project.name}
            imageUrl={event.project.imageUrl}
            className="size-7"
            showName={false}
          />
        </div>
      </div>
    </Link>
  );
}
