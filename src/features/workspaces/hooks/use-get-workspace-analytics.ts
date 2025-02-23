import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceAnalytics = ({
  workspaceId,
  memberId,
}: {
  workspaceId: string;
  memberId?: string;
}) => {
  const query = useQuery({
    queryKey: ["projects", "analytics", workspaceId, memberId],
    queryFn: async () => {
      const res = await client.api.workspaces[":workspaceId"].analytics.$get({
        param: { workspaceId },
        query: { memberId },
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
