import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type AnalyticsResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["analytics"]["$get"]
>;

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

      return await res.json();
    },
  });

  return query;
};
