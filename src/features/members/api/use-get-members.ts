import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetMembers = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await client.api.members.$get({ query: { workspaceId } });

      if (!res.ok) {
        const resData = await res.json();
        return resData;
      }

      return await res.json();
    },
  });

  return query;
};
