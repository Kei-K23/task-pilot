import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { useGetTasks } from "../api/use-get-tasks";
import { useGetProjectIdParam } from "@/features/projects/hooks/use-get-project-id-param";

export default function TaskTableContent() {
  const workspaceId = useGetWorkspaceParam();
  const projectId = useGetProjectIdParam();
  const { data: tasks } = useGetTasks({ workspaceId, projectId });

  return (
    <div className="flex flex-col">
      {tasks?.map?.((task) => (
        <span key={task.$id}>{task.name}</span>
      ))}
    </div>
  );
}
