import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetProjectAnalytics = ({
  projectId,
  workspaceId,
}: {
  projectId: string;
  workspaceId: string;
}) => {
  const query = useQuery({
    queryKey: ["projects", "analytics", workspaceId, projectId],
    queryFn: async () => {
      const res = await client.api.projects[":projectId"].analytics.$get({
        query: { workspaceId },
        param: { projectId },
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
