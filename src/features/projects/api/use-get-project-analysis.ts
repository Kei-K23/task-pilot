import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type ProjectAnalysisResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["analysis"]["$get"]
>;

export const useGetProjectAnalysis = ({
  projectId,
  workspaceId,
}: {
  projectId: string;
  workspaceId: string;
}) => {
  const query = useQuery({
    queryKey: ["projects", "analysis", workspaceId, projectId],
    queryFn: async () => {
      const res = await client.api.projects[":projectId"].analysis.$get({
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
