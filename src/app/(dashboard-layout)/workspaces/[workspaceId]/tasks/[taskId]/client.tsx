"use client";

import DotdotSeparator from "@/components/dotdot-separator";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetTaskByIdWithRelatedTasks } from "@/features/tasks/api/use-get-task-by-id-with-related-tasks copy";
import TaskBreadcrumbs from "@/features/tasks/components/task-breadcrumbs";
import TaskOverviewCard from "@/features/tasks/components/task-overview-card";
import useGetTaskIdParam from "@/features/tasks/hooks/use-get-task-id-param";
import { Task, TASK_STATUS } from "@/features/tasks/type";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Dot, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function TaskIdClientPage() {
  const workspaceId = useGetWorkspaceIdParam();
  const taskId = useGetTaskIdParam();
  const { data, isLoading, error } = useGetTaskByIdWithRelatedTasks({
    taskId,
    workspaceId,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if ((!isLoading && !data) || (!isLoading && error !== null)) {
    return <PageError />;
  }

  if (!data) {
    return <PageError />;
  }

  return (
    <div>
      <TaskBreadcrumbs task={data} project={data.project} />
      <DotdotSeparator className="my-4" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverviewCard task={data} />
        <TasksContainer tasks={data.relatedTasks} workspaceId={workspaceId} />
      </div>
    </div>
  );
}

interface TasksContainerProps {
  tasks?: Task[];
  workspaceId: string;
}

const TasksContainer = ({ tasks, workspaceId }: TasksContainerProps) => {
  return (
    <>
      <div className="p-4 rounded-lg border">
        <div className="flex items-center justify-between gap-x-4">
          <span className="text-lg font-bold">
            Other Related Tasks ({tasks?.length})
          </span>
        </div>
        <DotdotSeparator className="my-3" />
        <ul className="space-y-3">
          {tasks?.slice(0, 3).map((task) => (
            <li
              key={task.$id}
              className="border p-4 rounded-md flex items-center justify-between gap-x-4"
            >
              <div>
                <div className="flex items-center gap-x-3">
                  <span className="font-semibold">{task.name}</span>
                  <Badge variant={task.status as TASK_STATUS}>
                    {task.status}
                  </Badge>
                </div>
                <div className="mt-1 text-muted-foreground text-sm flex items-center gap-x-1">
                  <span>{task.project.name}</span>
                  <Dot />
                  <span className="flex items-center gap-x-1">
                    <Calendar className="size-4" />{" "}
                    {formatDistanceToNow(task.$createdAt)}
                  </span>
                </div>
              </div>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Button variant={"outline"} size={"sm"}>
                  <ExternalLink />
                </Button>
              </Link>
            </li>
          ))}
          <li className="hidden text-center text-base text-muted-foreground first-of-type:block">
            No tasks found
          </li>
        </ul>
        {tasks && tasks?.length > 0 && (
          <Link href={`/workspaces/${workspaceId}/tasks`}>
            <Button className="w-full mt-4" variant={"outline"}>
              Show All
            </Button>
          </Link>
        )}
      </div>
    </>
  );
};
