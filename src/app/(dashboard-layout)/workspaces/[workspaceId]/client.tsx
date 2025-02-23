"use client";

import AnalyticsContainer from "@/components/analysis-container";
import DotdotSeparator from "@/components/dotdot-separator";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCurrentMember } from "@/features/members/api/use-get-current-member";
import { useGetMembers } from "@/features/members/api/use-get-members";
import MemberAvatar from "@/features/members/components/member-avatar";
import { MemberWithUserData } from "@/features/members/type";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import CreateProjectModal from "@/features/projects/components/create-project-modal";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useOpenCreateProjectModal } from "@/features/projects/hooks/use-open-create-project-modal";
import { Project } from "@/features/projects/type";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import CreateTaskModal from "@/features/tasks/components/create-task-modal";
import { useOpenCreateTaskModal } from "@/features/tasks/hooks/use-open-create-task-modal";
import { Task, TASK_STATUS } from "@/features/tasks/type";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/hooks/use-get-workspace-analytics";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { MEMBER_ROLE } from "@/features/workspaces/type";
import { getGreeting } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Dot, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";

export default function WorkspaceIdClientPage() {
  const workspaceId = useGetWorkspaceIdParam();
  const { data: currentMemberData, isLoading: isLoadingCurrentMemberData } =
    useGetCurrentMember(workspaceId);
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
    isLoadingCurrentMemberData ||
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
      !currentMemberData ||
      !workspaceData)
  ) {
    return <PageError />;
  }

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold">
          {getGreeting()} {currentMemberData?.data?.name}
        </h2>
        <h3 className="text-lg text-muted-foreground">
          Welcome to &quot;{workspaceData?.name}&quot; workspace
        </h3>
      </div>
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
        <ProjectsContainer
          projects={projectsData?.documents || []}
          workspaceId={workspaceId}
        />
        <MembersContainer
          members={membersData?.data || []}
          workspaceId={workspaceId}
        />
      </div>
    </div>
  );
}

interface TasksContainerProps {
  tasks: Task[];
  workspaceId: string;
}

const TasksContainer = ({ tasks, workspaceId }: TasksContainerProps) => {
  const { setIsOpen: openCreateTaskModal } = useOpenCreateTaskModal();

  return (
    <>
      <CreateTaskModal />
      <div className="bg-neutral-100 p-4 rounded-lg border">
        <div className="flex items-center justify-between gap-x-4">
          <span className="text-lg font-bold">
            Total Tasks ({tasks?.length})
          </span>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              openCreateTaskModal({
                openCreateTaskModal: true,
              });
            }}
          >
            <Plus />
          </Button>
        </div>
        <DotdotSeparator className="my-3" />
        <ul className="space-y-3">
          {tasks.slice(0, 3).map((task) => (
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
            <Button className="w-full mt-4" variant={"secondary"}>
              Show All
            </Button>
          </Link>
        )}
      </div>
    </>
  );
};

interface ProjectsContainerProps {
  projects: Project[];
  workspaceId: string;
}

const ProjectsContainer = ({
  projects,
  workspaceId,
}: ProjectsContainerProps) => {
  const { setIsOpen: openCreateProjectModal } = useOpenCreateProjectModal();
  return (
    <>
      <CreateProjectModal />
      <div className="bg-neutral-100 p-4 rounded-lg border">
        <div className="flex items-center justify-between gap-x-4">
          <span className="text-lg font-bold">
            Projects ({projects?.length})
          </span>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              openCreateProjectModal(true);
            }}
          >
            <Plus />
          </Button>
        </div>
        <DotdotSeparator className="my-3" />
        <ul className="grid grid-cols-2 gap-x-5 gap-y-3">
          {projects.map((project) => (
            <li
              key={project.$id}
              className="bg-white rounded-md flex items-center justify-between gap-x-4 group border transition-colors"
            >
              <Link
                className="w-full h-full p-4 group-hover:bg-neutral-100/50 transition-colors rounded-md"
                href={`/workspaces/${workspaceId}/projects/${project.$id}`}
              >
                <div>
                  <ProjectAvatar
                    name={project.name}
                    imageUrl={project.imageUrl}
                    textClassName="text-base"
                  />
                </div>
              </Link>
            </li>
          ))}
          <li className="hidden col-span-2 text-center text-base text-muted-foreground first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </>
  );
};

interface MembersContainerProps {
  members: MemberWithUserData[];
  workspaceId: string;
}

const MembersContainer = ({ members, workspaceId }: MembersContainerProps) => {
  return (
    <div className="bg-neutral-100 p-4 rounded-lg border">
      <div className="flex items-center justify-between gap-x-4">
        <span className="text-lg font-bold">Members ({members?.length})</span>
      </div>
      <DotdotSeparator className="my-3" />
      <ul className="grid grid-cols-3 gap-x-5 gap-y-3">
        {members.slice(0, 6).map((member) => {
          return (
            <li
              key={member.$id}
              className="bg-white rounded-md flex items-center justify-center flex-col group border transition-colors py-4 px-3"
            >
              <MemberAvatar
                name={member.name}
                color={member.color}
                className="size-16"
                textClassName="text-2xl"
              />
              <span className="mt-3 text-lg">{member.name}</span>
              <Badge
                variant={
                  member.role === MEMBER_ROLE.ADMIN ? "destructive" : "default"
                }
              >
                <span className="text-xs">{member.role}</span>
              </Badge>
            </li>
          );
        })}
        <li className="hidden text-center text-base text-muted-foreground first-of-type:block">
          No members found
        </li>
      </ul>
      <Link href={`/workspaces/${workspaceId}/members`}>
        <Button className="w-full mt-4" variant={"secondary"}>
          Show All
        </Button>
      </Link>
    </div>
  );
};
