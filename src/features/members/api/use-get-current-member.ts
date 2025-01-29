import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentMember = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["members", "current-member"],
    queryFn: async () => {
      const res = await client.api.members["current-member"]["$get"]({
        query: { workspaceId },
      });

      if (!res.ok) {
        const resData = await res.json();
        return resData;
      }

      return await res.json();
    },
  });

  return query;
};
