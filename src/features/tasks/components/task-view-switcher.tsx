import DotdotSeparator from "@/components/dotdot-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import CreateTaskModal from "./create-task-modal";
import { useOpenCreateTaskModal } from "../hooks/use-open-create-task-modal";

export default function TaskViewSwitcher() {
  const { setIsOpen } = useOpenCreateTaskModal();
  return (
    <>
      <CreateTaskModal />
      <Tabs defaultValue="table" className="">
        <div className="flex items-center gap-x-4 justify-between">
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="calender">Calender</TabsTrigger>
          </TabsList>
          <Button
            size={"sm"}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <Plus /> New
          </Button>
        </div>
        <DotdotSeparator className="my-4" />
        <div>Date filter</div>
        <DotdotSeparator className="my-4" />
        <TabsContent value="table">table</TabsContent>
        <TabsContent value="kanban">kanban</TabsContent>
        <TabsContent value="calender">calender</TabsContent>
      </Tabs>
    </>
  );
}
