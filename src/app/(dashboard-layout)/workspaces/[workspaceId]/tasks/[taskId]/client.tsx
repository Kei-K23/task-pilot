"use client";

import DotdotSeparator from "@/components/dotdot-separator";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetTaskById } from "@/features/tasks/api/use-get-task-by-id";
import TaskBreadcrumbs from "@/features/tasks/components/task-breadcrumbs";
import TaskOverviewCard from "@/features/tasks/components/task-overview-card";
import useGetTaskIdParam from "@/features/tasks/hooks/use-get-task-id-param";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";

export default function TaskIdClientPage() {
  const workspaceId = useGetWorkspaceIdParam();
  const taskId = useGetTaskIdParam();
  const { data, isLoading, error } = useGetTaskById({ taskId, workspaceId });

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
      <div className="grid grid-cols-1 md:grid-cols-2">
        <TaskOverviewCard task={data} />
        {/* TODO I'm planning to show other user related tasks */}
      </div>
    </div>
  );
}
