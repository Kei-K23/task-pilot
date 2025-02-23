import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetMemberById } from "@/features/members/api/use-member-by-id";
import { useGetMemberIdParam } from "@/features/members/hooks/use-get-member-id-param";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/hooks/use-get-workspace-analytics";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";

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
  } = useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasksData, isLoading: isLoadingTasksData } = useGetTasks({
    workspaceId,
  });
  const { data: projectsData, isLoading: isLoadingProjectsData } =
    useGetProjects({ workspaceId });

  const isLoading =
    isLoadingProjectsData ||
    isLoadingTasksData ||
    isLoadingWorkspaceData ||
    isLoadingMemberByIdData ||
    isLoadingWorkspaceAnalyticsData;

  if (isLoading) {
    return <PageLoader />;
  }

  if (
    !isLoading &&
    (!workspaceAnalyticsData ||
      !tasksData ||
      !projectsData ||
      !memberByIdData ||
      !workspaceData)
  ) {
    return <PageError />;
  }

  return <div></div>;
}
