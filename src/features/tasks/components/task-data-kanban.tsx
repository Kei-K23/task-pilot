import { useState } from "react";
import { Task, TASK_STATUS } from "../type";
import { DragDropContext } from "@hello-pangea/dnd";
import TaskKanbanHeader from "./task-kanban-header";

interface TaskDataKanbanProps {
  data: Task[];
  isLoading: boolean;
}

type TasksState = {
  [key in TASK_STATUS]: Task[];
};

const boards: TASK_STATUS[] = [
  TASK_STATUS.BACKLOG,
  TASK_STATUS.TODO,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.IN_REVIEW,
  TASK_STATUS.DONE,
];

export default function TaskDataKanban({
  data,
  isLoading,
}: TaskDataKanbanProps) {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initTasksState: TasksState = {
      [TASK_STATUS.BACKLOG]: [],
      [TASK_STATUS.TODO]: [],
      [TASK_STATUS.IN_PROGRESS]: [],
      [TASK_STATUS.IN_REVIEW]: [],
      [TASK_STATUS.DONE]: [],
    };
    // Add tasks to their related task status
    data.forEach((task) => {
      initTasksState[task.status as TASK_STATUS].push(task);
    });

    // Sort the tasks
    data.forEach((task) => {
      initTasksState[task.status as TASK_STATUS].sort(
        (a, b) => a.position - b.position
      );
    });

    return initTasksState;
  });

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex overflow-x-auto gap-x-4 items-center">
        {boards.map((board) => (
          <TaskKanbanHeader
            key={board}
            board={board}
            tasksCount={tasks[board].length}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
