import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { useGetTasks } from "../api/use-get-tasks";
import { useGetProjectIdParam } from "@/features/projects/hooks/use-get-project-id-param";
import useTasksFilterQuery from "../hooks/use-tasks-filter-query";

export default function TaskTableContent() {
  const [{ assigneeId, search, status, dueDate }] = useTasksFilterQuery();
  const workspaceId = useGetWorkspaceParam();
  const projectId = useGetProjectIdParam();
  const { data: tasks } = useGetTasks({
    workspaceId,
    projectId,
    status,
    assigneeId,
    search,
    dueDate,
  });

  return (
    <div className="flex flex-col">
      {tasks?.map?.((task) => (
        <span key={task.$id}>{task.name}</span>
      ))}
    </div>
  );
}
