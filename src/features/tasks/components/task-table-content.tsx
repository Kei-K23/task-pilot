import { TaskDataTable } from "./task-data-table";
import { taskColumns } from "./task-columns";
import { Task } from "../type";

interface TaskTableContentProps {
  data: Task[];
  isLoading: boolean;
}

export default function TaskTableContent({
  data,
  isLoading,
}: TaskTableContentProps) {
  return (
    <div className="flex flex-col">
      <TaskDataTable
        columns={taskColumns}
        data={data || []}
        isLoading={isLoading}
      />
    </div>
  );
}
