import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetMemberById = ({
  workspaceId,
  memberId,
}: {
  workspaceId: string;
  memberId: string;
}) => {
  const query = useQuery({
    queryKey: ["members", "current-member", memberId],
    queryFn: async () => {
      const res = await client.api.members[":memberId"]["$get"]({
        query: { workspaceId },
        param: { memberId },
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
