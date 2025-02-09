import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { useGetTasks } from "../api/use-get-tasks";
import useTasksFilterQuery from "../hooks/use-tasks-filter-query";
import { TaskDataTable } from "./task-data-table";
import { taskColumns } from "./task-columns";
import { useGetProjectIdParam } from "@/features/projects/hooks/use-get-project-id-param";

export default function TaskTableContent() {
  const [{ assigneeId, projectId, search, status, dueDate }] =
    useTasksFilterQuery();
  const workspaceId = useGetWorkspaceParam();
  const projectIdParam = useGetProjectIdParam();
  console.log(projectId);

  const { data: tasksData, isPending } = useGetTasks({
    workspaceId,
    projectId:
      projectId === null
        ? projectIdParam
        : projectId === "all"
        ? null
        : projectId === "default"
        ? projectIdParam
        : projectId,
    status,
    assigneeId,
    search,
    dueDate,
  });

  return (
    // TODO Fix type error
    <div className="flex flex-col">
      <TaskDataTable
        columns={taskColumns}
        data={tasksData || []}
        isLoading={isPending}
      />
    </div>
  );
}
