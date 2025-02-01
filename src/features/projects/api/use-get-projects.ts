import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaces = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await client.api.projects.$get({
        query: { workspaceId },
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
