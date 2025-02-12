import { useCallback, useEffect, useState } from "react";
import { PositionedTask, Task, TASK_STATUS } from "../type";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import TaskKanbanHeader from "./task-kanban-header";
import TaskKanbanItem from "./task-kanban-item";

interface TaskDataKanbanProps {
  data: Task[];
  onChangePosition: (tasks: PositionedTask[]) => void;
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

  const handleOnDragEnd = useCallback((result: DropResult) => {
    console.log(result);
    // If destination item is not exist, then return
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceStatus = source.droppableId as TASK_STATUS;
    const destinationStatus = destination.droppableId as TASK_STATUS;

    const updatesPayload: PositionedTask[] = [];

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      // Safely remove the task from source column to add new moved task to destination column
      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1); // Moved task from source column

      // This case never ever cannot be happen
      if (!movedTask) {
        console.error("No task found at source index");
        return prevTasks;
      }

      // Check tasks to new column or just moved position in the same column
      const updateMovedTask: Task =
        sourceStatus !== destinationStatus
          ? { ...movedTask, status: destinationStatus }
          : movedTask;

      // Update source column
      newTasks[sourceStatus] = sourceColumn;

      // Add new moved task to destination column and update destination column
      const destinationColumn = [...newTasks[destinationStatus]];
      destinationColumn.splice(destination.index, 0, updateMovedTask);
      newTasks[destinationStatus] = destinationColumn;

      // Always update the moved tasks
      updatesPayload.push({
        $id: updateMovedTask.$id,
        status: updateMovedTask.status as TASK_STATUS,
        position: Math.min((destination.index + 1) * 1000, 1_000_000),
      });

      // Update destination tasks item position
      newTasks[destinationStatus].forEach((task, index) => {
        if (task && task.$id !== updateMovedTask.$id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          // If current position of destination task item is not equal updated new position, then add to updatesPayload to also update in the backend and save to database
          if (task.position !== newPosition) {
            updatesPayload.push({
              $id: task.$id,
              status: task.status as TASK_STATUS,
              position: newPosition,
            });
          }
        }
      });

      // If the task moved between columns (source between destination), update position in the source column
      if (sourceStatus !== destinationStatus) {
        newTasks[sourceStatus].forEach((task, index) => {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          if (task.position !== newPosition) {
            updatesPayload.push({
              $id: task.$id,
              status: task.status as TASK_STATUS,
              position: newPosition,
            });
          }
        });
      }

      return newTasks;
    });

    console.log(updatesPayload, updatesPayload.length);
  }, []);

  // Update the state for tasks
  useEffect(() => {
    const newTasksState: TasksState = {
      [TASK_STATUS.BACKLOG]: [],
      [TASK_STATUS.TODO]: [],
      [TASK_STATUS.IN_PROGRESS]: [],
      [TASK_STATUS.IN_REVIEW]: [],
      [TASK_STATUS.DONE]: [],
    };
    // Add tasks to their related task status
    data.forEach((task) => {
      newTasksState[task.status as TASK_STATUS].push(task);
    });

    // Sort the tasks
    data.forEach((task) => {
      newTasksState[task.status as TASK_STATUS].sort(
        (a, b) => a.position - b.position
      );
    });

    setTasks(newTasksState);
  }, [data]);

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
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
                      draggableId={`${task.name}-${index}`}
                      key={`${task.name}-${index}`}
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
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
