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
  projectId?: string | null;
  assigneeId?: string | null;
  search?: string | null;
  dueDate?: string | null;
  status?: TASK_STATUS | null;
}) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      assigneeId,
      search,
      dueDate,
      status,
    ],
    queryFn: async () => {
      const res = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          assigneeId: assigneeId ?? undefined,
          search: search ?? undefined,
          status: status ?? undefined,
          dueDate: dueDate ?? undefined,
        },
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
