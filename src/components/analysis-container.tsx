import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import AnalyticsCard from "./analytics-card";

interface AnalyticsContainerProps {
  projectAnalyticsData: AnalyticsResponseType;
}

export default function AnalyticsContainer({
  projectAnalyticsData,
}: AnalyticsContainerProps) {
  if (!projectAnalyticsData.data) {
    return null;
  }

  return (
    <ScrollArea className="w-full shrink-0 whitespace-nowrap">
      <div className="flex w-max flex-row gap-x-3">
        <div className="flex items-center flex-1 w-full">
          <AnalyticsCard
            label="Total Tasks"
            value={projectAnalyticsData.data?.taskCount || 0}
            variant={projectAnalyticsData.data?.taskDiff > 0 ? "up" : "down"}
            increaseValue={projectAnalyticsData.data?.taskDiff || 0}
          />
        </div>
        <div className="flex items-center flex-1 w-full">
          <AnalyticsCard
            label="Assigned Tasks"
            value={projectAnalyticsData.data?.assignedTaskCount || 0}
            variant={
              projectAnalyticsData.data?.assignedTaskDiff > 0 ? "up" : "down"
            }
            increaseValue={projectAnalyticsData.data?.assignedTaskDiff || 0}
          />
        </div>
        <div className="flex items-center flex-1 w-full">
          <AnalyticsCard
            label="Completed Tasks"
            value={projectAnalyticsData.data?.completeTaskCount || 0}
            variant={
              projectAnalyticsData.data?.completeTaskDiff > 0 ? "up" : "down"
            }
            increaseValue={projectAnalyticsData.data?.completeTaskDiff || 0}
          />
        </div>
        <div className="flex items-center flex-1 w-full">
          <AnalyticsCard
            label="Incomplete Tasks"
            value={projectAnalyticsData.data?.incompleteTaskCount || 0}
            variant={
              projectAnalyticsData.data?.incompleteTaskDiff > 0 ? "up" : "down"
            }
            increaseValue={projectAnalyticsData.data?.incompleteTaskDiff || 0}
          />
        </div>
        <div className="flex items-center flex-1 w-full">
          <AnalyticsCard
            label="Overdue Tasks"
            value={projectAnalyticsData.data?.overDueTaskCount || 0}
            variant={
              projectAnalyticsData.data?.overDueTaskDiff > 0 ? "up" : "down"
            }
            increaseValue={projectAnalyticsData.data?.overDueTaskDiff || 0}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
