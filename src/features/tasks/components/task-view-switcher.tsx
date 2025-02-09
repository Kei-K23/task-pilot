import DotdotSeparator from "@/components/dotdot-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import CreateTaskModal from "./create-task-modal";
import { useOpenCreateTaskModal } from "../hooks/use-open-create-task-modal";
import TaskTableContent from "./task-table-content";
import DataFilter from "./data-filter";
import { useQueryState } from "nuqs";
import useTasksFilterQuery from "../hooks/use-tasks-filter-query";
import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { useGetProjectIdParam } from "@/features/projects/hooks/use-get-project-id-param";
import { useGetTasks } from "../api/use-get-tasks";

export default function TaskViewSwitcher() {
  const [tasksView, setTasksView] = useQueryState("tasks-view", {
    defaultValue: "table",
  });
  const { setIsOpen } = useOpenCreateTaskModal();
  const [{ assigneeId, projectId, search, status, dueDate }] =
    useTasksFilterQuery();
  const workspaceId = useGetWorkspaceParam();
  const projectIdParam = useGetProjectIdParam();

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
    <>
      <CreateTaskModal />
      <Tabs defaultValue={tasksView} onValueChange={setTasksView}>
        <div className="flex items-center gap-x-4 gap-y-2 justify-between flex-col md:flex-row">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger className="w-full md:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="w-full md:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="w-full md:w-auto" value="calender">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button
            className="w-full md:w-auto"
            size={"sm"}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <Plus /> New Task
          </Button>
        </div>
        <DotdotSeparator className="my-4" />
        <DataFilter />
        <DotdotSeparator className="my-4" />
        <TabsContent value="table">
          <TaskTableContent data={tasksData || []} isLoading={isPending} />
        </TabsContent>
        <TabsContent value="kanban">kanban</TabsContent>
        <TabsContent value="calender">calender</TabsContent>
      </Tabs>
    </>
  );
}
