import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type AnalyticsResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["analytics"]["$get"]
>;

export const useGetWorkspaceAnalytics = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const query = useQuery({
    queryKey: ["projects", "analytics", workspaceId],
    queryFn: async () => {
      const res = await client.api.workspaces[":workspaceId"].analytics.$get({
        param: { workspaceId },
      });

      if (!res.ok) {
        return null;
      }

      return await res.json();
    },
  });

  return query;
};
