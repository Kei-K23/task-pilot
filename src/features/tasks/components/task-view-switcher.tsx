import DotdotSeparator from "@/components/dotdot-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export default function TaskViewSwitcher() {
  return (
    <Tabs defaultValue="table" className="">
      <div className="flex items-center gap-x-4 justify-between">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="calender">Calender</TabsTrigger>
        </TabsList>
        <Button size={"sm"}>
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
  );
}
