import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetTaskById = ({
  workspaceId,
  taskId,
}: {
  workspaceId: string;
  taskId: string;
}) => {
  const query = useQuery({
    queryKey: ["tasks", workspaceId, taskId],
    queryFn: async () => {
      const res = await client.api.tasks[":taskId"].$get({
        param: {
          taskId,
        },
        query: {
          workspaceId,
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
