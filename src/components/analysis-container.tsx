import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AnalyticsCard from "./analytics-card";
import { ProjectAnalyticsResponse } from "@/features/projects/type";

interface AnalyticsContainerProps {
  analyticsData: ProjectAnalyticsResponse;
}

export default function AnalyticsContainer({
  analyticsData,
}: AnalyticsContainerProps) {
  return (
    <ScrollArea className="w-full shrink-0 whitespace-nowrap">
      <div className="flex w-max flex-row gap-x-3">
        <div className="flex items-center flex-1 w-full">
          <AnalyticsCard
            label="Total Tasks"
            value={analyticsData?.taskCount || 0}
            variant={analyticsData?.taskDiff > 0 ? "up" : "down"}
            increaseValue={analyticsData?.taskDiff || 0}
          />
        </div>
        <div className="flex items-center flex-1 w-full">
          <AnalyticsCard
            label="Assigned Tasks"
            value={analyticsData?.assignedTaskCount || 0}
            variant={analyticsData?.assignedTaskDiff > 0 ? "up" : "down"}
            increaseValue={analyticsData?.assignedTaskDiff || 0}
          />
        </div>
        <div className="flex items-center flex-1 w-full">
          <AnalyticsCard
            label="Completed Tasks"
            value={analyticsData?.completeTaskCount || 0}
            variant={analyticsData?.completeTaskDiff > 0 ? "up" : "down"}
            increaseValue={analyticsData?.completeTaskDiff || 0}
          />
        </div>
        <div className="flex items-center flex-1 w-full">
          <AnalyticsCard
            label="Incomplete Tasks"
            value={analyticsData?.incompleteTaskCount || 0}
            variant={analyticsData?.incompleteTaskDiff > 0 ? "up" : "down"}
            increaseValue={analyticsData?.incompleteTaskDiff || 0}
          />
        </div>
        <div className="flex items-center flex-1 w-full">
          <AnalyticsCard
            label="Overdue Tasks"
            value={analyticsData?.overDueTaskCount || 0}
            variant={analyticsData?.overDueTaskDiff > 0 ? "up" : "down"}
            increaseValue={analyticsData?.overDueTaskDiff || 0}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
