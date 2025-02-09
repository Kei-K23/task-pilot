import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import useTasksFilterQuery from "../hooks/use-tasks-filter-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUS } from "../type";
import { ListChecks, Users } from "lucide-react";
import MemberAvatar from "@/features/members/components/member-avatar";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";

export default function DataFilter() {
  const workspaceId = useGetWorkspaceParam();
  const { data: memberOptions, isLoading: memberOptionLoading } = useGetMembers(
    { workspaceId }
  );

  const members = memberOptions?.data?.map((member) => ({
    id: member.$id,
    name: member.name,
    color: member.color,
  }));

  const [{ assigneeId, status, dueDate }, setFilterQuery] =
    useTasksFilterQuery();

  const isFetchingAssociatedDate = memberOptionLoading;

  const handleStatusFilter = (value: string) => {
    setFilterQuery({ status: value === "all" ? null : (value as TASK_STATUS) });
  };

  const handleAssigneeFilter = (value: string) => {
    setFilterQuery({ assigneeId: value === "all" ? null : value });
  };

  const clearFilters = () => {
    setFilterQuery({
      assigneeId: null,
      status: null,
      dueDate: null,
    });
  };

  return (
    <div className="flex items-center justify-between gap-x-2">
      <div className="flex items-center gap-x-2">
        <Select onValueChange={handleStatusFilter} value={status ?? "all"}>
          <SelectTrigger className="focus:ring-0">
            <div className="flex items-center gap-x-2">
              <ListChecks className="size-4" />
              <SelectValue placeholder="Select status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectSeparator />
            <SelectItem value={TASK_STATUS.BACKLOG}>
              {TASK_STATUS.BACKLOG}
            </SelectItem>
            <SelectItem value={TASK_STATUS.IN_PROGRESS}>
              {TASK_STATUS.IN_PROGRESS}
            </SelectItem>
            <SelectItem value={TASK_STATUS.IN_REVIEW}>
              {TASK_STATUS.IN_REVIEW}
            </SelectItem>
            <SelectItem value={TASK_STATUS.TODO}>{TASK_STATUS.TODO}</SelectItem>
            <SelectItem value={TASK_STATUS.DONE}>{TASK_STATUS.DONE}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={handleAssigneeFilter}
          value={assigneeId ?? "all"}
        >
          <SelectTrigger
            className="focus:ring-0"
            disabled={isFetchingAssociatedDate}
          >
            <div className="flex items-center gap-x-2">
              <Users className="size-4" />
              <SelectValue placeholder="Select assignee" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            <SelectSeparator />
            {members?.map?.((member) => (
              <SelectItem key={member.id} value={member.id}>
                <div className="flex items-center gap-x-2">
                  <MemberAvatar
                    name={member.name}
                    color={member.color}
                    className="size-7"
                  />
                  <span>{member.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePicker
          date={dueDate ? new Date(dueDate) : undefined}
          setDate={(date) => {
            setFilterQuery({ dueDate: date ? date?.toISOString() : null });
          }}
          placeholder="Due date"
        />
      </div>
      <Button onClick={clearFilters} size="sm" className="font-bold">
        Clear filter
      </Button>
    </div>
  );
}
