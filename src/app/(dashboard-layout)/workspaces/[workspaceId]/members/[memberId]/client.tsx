"use client";

import AnalyticsContainer from "@/components/analysis-container";
import DotdotSeparator from "@/components/dotdot-separator";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetMemberById } from "@/features/members/api/use-member-by-id";
import { useGetMemberIdParam } from "@/features/members/hooks/use-get-member-id-param";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import CreateTaskModal from "@/features/tasks/components/create-task-modal";
import { Task, TASK_STATUS } from "@/features/tasks/type";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/hooks/use-get-workspace-analytics";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Dot, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function MemberIdClientPage() {
  const memberId = useGetMemberIdParam();
  const workspaceId = useGetWorkspaceIdParam();

  const { data: memberByIdData, isLoading: isLoadingMemberByIdData } =
    useGetMemberById({ workspaceId, memberId });
  const { data: workspaceData, isLoading: isLoadingWorkspaceData } =
    useGetWorkspaceById({ workspaceId });
  const {
    data: workspaceAnalyticsData,
    isLoading: isLoadingWorkspaceAnalyticsData,
  } = useGetWorkspaceAnalytics({ workspaceId, memberId });
  const { data: tasksData, isLoading: isLoadingTasksData } = useGetTasks({
    workspaceId,
    assigneeId: memberId,
  });

  const isLoading =
    isLoadingTasksData ||
    isLoadingWorkspaceData ||
    isLoadingMemberByIdData ||
    isLoadingWorkspaceAnalyticsData;

  if (isLoading) {
    return <PageLoader />;
  }

  if (
    !isLoading &&
    (!workspaceAnalyticsData || !tasksData || !memberByIdData || !workspaceData)
  ) {
    return <PageError />;
  }

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold">
          {memberByIdData?.data?.name}&apos;s Profile
        </h2>
      </div>
      {!!workspaceAnalyticsData && (
        <>
          <div className="mt-4">
            <AnalyticsContainer analyticsData={workspaceAnalyticsData} />
          </div>
          <DotdotSeparator className="my-4" />
        </>
      )}

      <div className="w-full">
        <TasksContainer workspaceId={workspaceId} tasks={tasksData || []} />
      </div>
    </div>
  );
}

interface TasksContainerProps {
  tasks: Task[];
  workspaceId: string;
}

const TasksContainer = ({ tasks, workspaceId }: TasksContainerProps) => {
  return (
    <>
      <CreateTaskModal />
      <div className="bg-neutral-100 p-4 rounded-lg border">
        <div className="flex items-center justify-between gap-x-4">
          <span className="text-lg font-bold">
            Total Tasks ({tasks?.length})
          </span>
        </div>
        <DotdotSeparator className="my-3" />
        <ul className="space-y-3">
          {tasks.slice(0, 10).map((task) => (
            <li
              key={task.$id}
              className="bg-white border p-4 rounded-md flex items-center justify-between gap-x-4"
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
        {tasks.length > 0 && (
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
