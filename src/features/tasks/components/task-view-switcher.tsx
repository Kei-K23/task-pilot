import DotdotSeparator from "@/components/dotdot-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import CreateTaskModal from "./create-task-modal";
import { useOpenCreateTaskModal } from "../hooks/use-open-create-task-modal";
import TaskTableContent from "./task-table-content";

export default function TaskViewSwitcher() {
  const { setIsOpen } = useOpenCreateTaskModal();
  return (
    <>
      <CreateTaskModal />
      <Tabs defaultValue="table" className="">
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
        <div>Date filter</div>
        <DotdotSeparator className="my-4" />
        <TabsContent value="table">
          <TaskTableContent />
        </TabsContent>
        <TabsContent value="kanban">kanban</TabsContent>
        <TabsContent value="calender">calender</TabsContent>
      </Tabs>
    </>
  );
}
