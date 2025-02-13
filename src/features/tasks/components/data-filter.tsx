import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import useTasksFilterQuery from "../hooks/use-tasks-filter-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUS } from "../type";
import { Folder, ListChecks, Users } from "lucide-react";
import MemberAvatar from "@/features/members/components/member-avatar";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import ProjectAvatar from "@/features/projects/components/project-avatar";

interface DataFilterProps {
  showProjectFilter?: boolean;
}

export default function DataFilter({
  showProjectFilter = true,
}: DataFilterProps) {
  const workspaceId = useGetWorkspaceIdParam();
  const { data: memberOptions, isLoading: memberOptionLoading } = useGetMembers(
    { workspaceId }
  );
  const { data: projectOptions, isLoading: projectOptionLoading } =
    useGetProjects({ workspaceId });

  const members = memberOptions?.data?.map((member) => ({
    id: member.$id,
    name: member.name,
    color: member.color,
  }));

  const projects = projectOptions?.documents?.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const [{ assigneeId, status, dueDate, projectId }, setFilterQuery] =
    useTasksFilterQuery();

  const isFetchingAssociatedDate = memberOptionLoading || projectOptionLoading;

  const handleStatusFilter = (value: string) => {
    setFilterQuery({ status: value === "all" ? null : (value as TASK_STATUS) });
  };

  const handleAssigneeFilter = (value: string) => {
    setFilterQuery({ assigneeId: value === "all" ? null : value });
  };

  const handleProjectFilter = (value: string) => {
    setFilterQuery({
      projectId: value,
    });
  };

  const clearFilters = () => {
    setFilterQuery({
      assigneeId: null,
      projectId: null,
      status: null,
      dueDate: null,
    });
  };

  return (
    <div className="flex items-center justify-between gap-x-2">
      <div className="flex items-center gap-x-2">
        <Select onValueChange={handleStatusFilter} value={status ?? "all"}>
          <SelectTrigger className="focus:ring-0">
            <div className="flex items-center gap-x-2">
              <ListChecks className="size-4" />
              <SelectValue placeholder="Select status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectSeparator />
            <SelectItem value={TASK_STATUS.BACKLOG}>
              {TASK_STATUS.BACKLOG}
            </SelectItem>
            <SelectItem value={TASK_STATUS.IN_PROGRESS}>
              {TASK_STATUS.IN_PROGRESS}
            </SelectItem>
            <SelectItem value={TASK_STATUS.IN_REVIEW}>
              {TASK_STATUS.IN_REVIEW}
            </SelectItem>
            <SelectItem value={TASK_STATUS.TODO}>{TASK_STATUS.TODO}</SelectItem>
            <SelectItem value={TASK_STATUS.DONE}>{TASK_STATUS.DONE}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={handleAssigneeFilter}
          value={assigneeId ?? "all"}
        >
          <SelectTrigger
            className="focus:ring-0"
            disabled={isFetchingAssociatedDate}
          >
            <div className="flex items-center gap-x-2">
              <Users className="size-4" />
              <SelectValue placeholder="Select assignee" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            <SelectSeparator />
            {members?.map?.((member) => (
              <SelectItem key={member.id} value={member.id}>
                <div className="flex items-center gap-x-2">
                  <MemberAvatar
                    name={member.name}
                    color={member.color}
                    className="size-7"
                  />
                  <span>{member.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showProjectFilter && (
          <Select
            onValueChange={handleProjectFilter}
            value={projectId ?? "default"}
          >
            <SelectTrigger
              className="focus:ring-0"
              disabled={isFetchingAssociatedDate}
            >
              <div className="flex items-center gap-x-2">
                <Folder className="size-4" />
                <SelectValue placeholder="Select assignee" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default projects</SelectItem>
              <SelectItem value="all">All projects</SelectItem>
              <SelectSeparator />
              {projects?.map?.((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-x-2">
                    <ProjectAvatar
                      name={project.name}
                      imageUrl={project.imageUrl}
                      className="size-7"
                      showName={false}
                    />
                    <span>{project.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <DatePicker
          date={dueDate ? new Date(dueDate) : undefined}
          setDate={(date) => {
            setFilterQuery({ dueDate: date ? date?.toISOString() : null });
          }}
          placeholder="Due date"
        />
      </div>
      <Button onClick={clearFilters} size="sm" className="font-bold">
        Clear filter
      </Button>
    </div>
  );
}
