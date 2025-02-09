import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { useGetTasks } from "../api/use-get-tasks";
import { useGetProjectIdParam } from "@/features/projects/hooks/use-get-project-id-param";
import useTasksFilterQuery from "../hooks/use-tasks-filter-query";
import { TaskDataTable } from "./task-data-table";
import { taskColumns } from "./task-columns";

export default function TaskTableContent() {
  const [{ assigneeId, search, status, dueDate }] = useTasksFilterQuery();
  const workspaceId = useGetWorkspaceParam();
  const projectId = useGetProjectIdParam();
  const { data: tasksData, isPending } = useGetTasks({
    workspaceId,
    projectId,
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
