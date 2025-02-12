import { useState } from "react";
import { Task, TASK_STATUS } from "../type";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import TaskKanbanHeader from "./task-kanban-header";
import TaskKanbanItem from "./task-kanban-item";

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
      <div className="flex overflow-x-auto gap-x-4 items-start">
        {boards.map((board) => (
          <div key={board} className="min-w-[250px]">
            <TaskKanbanHeader board={board} tasksCount={tasks[board].length} />
            <Droppable droppableId={board}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[300px] py-2 px-3 bg-muted mt-2 space-y-2"
                >
                  {tasks[board].map((task, index) => (
                    <Draggable
                      index={index}
                      draggableId={`${task}-${index}`}
                      key={`${task}-${index}`}
                    >
                      {(provided) => (
                        <div
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <TaskKanbanItem task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
