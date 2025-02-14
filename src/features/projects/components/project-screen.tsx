"use client";

import { Button } from "@/components/ui/button";
import { Project } from "../type";
import ProjectAvatar from "./project-avatar";
import { Edit } from "lucide-react";
import Link from "next/link";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { Card, CardContent } from "@/components/ui/card";
import PageError from "@/components/page-error";
import { useGetProjectAnalytics } from "../api/use-get-project-analytics";
import AnalyticsContainer from "@/components/analysis-container";

interface ProjectScreenProps {
  project: Project;
}

export default function ProjectScreen({ project }: ProjectScreenProps) {
  const workspaceId = useGetWorkspaceIdParam();
  const fullHref = `/workspaces/${workspaceId}/projects/${project.$id}`;
  const {
    data: projectAnalyticsData,
    isLoading: isLoadingProjectAnalyticsData,
  } = useGetProjectAnalytics({ workspaceId, projectId: project.$id });

  if (!isLoadingProjectAnalyticsData && !projectAnalyticsData) {
    return <PageError />;
  }

  return (
    <div className="w-full mx-auto space-y-6 overflow-hidden">
      <div className="flex items-center justify-between gap-x-4">
        <ProjectAvatar imageUrl={project.imageUrl} name={project.name} />
        <Link href={`${fullHref}/settings`}>
          <Button variant={"outline"}>
            <Edit /> <span className="font-semibold">Edit</span>
          </Button>
        </Link>
      </div>
      {isLoadingProjectAnalyticsData ? (
        // TODO Implement loading skeleton
        <p>Loading...</p>
      ) : (
        projectAnalyticsData && (
          <AnalyticsContainer projectAnalyticsData={projectAnalyticsData} />
        )
      )}
      <Card>
        <CardContent className="mt-4">
          <TaskViewSwitcher />
        </CardContent>
      </Card>
    </div>
  );
}
