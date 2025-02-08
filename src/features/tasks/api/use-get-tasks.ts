import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { TASK_STATUS } from "../type";

export const useGetTasks = ({
  workspaceId,
  projectId,
  assigneeId,
  search,
  dueDate,
  status,
}: {
  workspaceId: string;
  projectId?: string;
  assigneeId?: string;
  search?: string;
  dueDate?: string;
  status?: TASK_STATUS;
}) => {
  const query = useQuery({
    queryKey: ["tasks", workspaceId, projectId],
    queryFn: async () => {
      const res = await client.api.tasks.$get({
        query: { workspaceId, projectId, assigneeId, search, status, dueDate },
      });

      if (!res.ok) {
        return null;
      }

      const { data } = await res.json();
      return data;
    },
  });

  return query;
};
