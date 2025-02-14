"use client";

import AnalyticsContainer from "@/components/analysis-container";
import DotdotSeparator from "@/components/dotdot-separator";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { Task } from "@/features/tasks/type";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/hooks/use-get-workspace-analytics";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Dot, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";

export default function WorkspaceIdClientPage() {
  const workspaceId = useGetWorkspaceIdParam();
  const { data: workspaceData, isLoading: isLoadingWorkspaceData } =
    useGetWorkspaceById({ workspaceId });
  const {
    data: workspaceAnalyticsData,
    isLoading: isLoadingWorkspaceAnalyticsData,
  } = useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasksData, isLoading: isLoadingTasksData } = useGetTasks({
    workspaceId,
  });
  const { data: projectsData, isLoading: isLoadingProjectsData } =
    useGetProjects({ workspaceId });
  const { data: membersData, isLoading: isLoadingMembersData } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingMembersData ||
    isLoadingProjectsData ||
    isLoadingTasksData ||
    isLoadingWorkspaceData ||
    isLoadingWorkspaceAnalyticsData;

  if (isLoading) {
    return <PageLoader />;
  }

  if (
    !isLoading &&
    (!workspaceAnalyticsData ||
      !tasksData ||
      !projectsData ||
      !membersData ||
      !workspaceData)
  ) {
    return <PageError />;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">
        Welcome to &quot;{workspaceData?.name}&quot; workspace
      </h2>
      {!!workspaceAnalyticsData && (
        <>
          <div className="mt-4">
            <AnalyticsContainer analyticsData={workspaceAnalyticsData} />
          </div>
          <DotdotSeparator className="my-4" />
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
    <div className="bg-neutral-100 p-4 rounded-lg border">
      <div className="flex items-center justify-between gap-x-4">
        <span className="text-lg font-bold">Tasks ({tasks?.length})</span>
        <Button variant={"outline"} size={"sm"}>
          <Plus />
        </Button>
      </div>
      <DotdotSeparator className="my-3" />
      <ul className="space-y-3">
        {tasks.slice(0, 3).map((task) => (
          <li
            key={task.$id}
            className="bg-white p-4 rounded-md flex items-center justify-between gap-x-4"
          >
            <div>
              <span className="font-semibold">{task.name}</span>
              <div className="mt-1 text-muted-foreground text-sm flex items-center gap-x-1">
                <span>{task.project.name}</span>
                <Dot />
                <span className="flex items-center gap-x-1">
                  <Calendar className="size-4" />{" "}
                  {formatDistanceToNow(task.project.$createdAt)}
                </span>
              </div>
            </div>
            <Button variant={"outline"} size={"sm"}>
              <ExternalLink />
            </Button>
          </li>
        ))}
        <li className="hidden text-center text-base text-muted-foreground first-of-type:block">
          No tasks found
        </li>
      </ul>
      <Link href={`/workspaces/${workspaceId}/tasks`}>
        <Button className="w-full mt-4" variant={"secondary"}>
          Show All
        </Button>
      </Link>
    </div>
  );
};
