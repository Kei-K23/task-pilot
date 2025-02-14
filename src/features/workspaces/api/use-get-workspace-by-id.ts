import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceById = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const query = useQuery({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => {
      const res = await client.api.workspaces[":workspaceId"].$get({
        param: {
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
