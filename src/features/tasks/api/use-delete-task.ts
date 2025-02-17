import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;

export const useDeleteTask = ({ workspaceId }: { workspaceId: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.tasks[":taskId"]["$delete"]({
        param,
        query: {
          workspaceId,
        },
      });

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.message || "Failed to delete the task");
      }

      return await res.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
      queryClient.invalidateQueries({
        queryKey: ["projects", "analytics", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", "analytics", workspaceId, data?.projectId],
      });
    },
  });

  return mutation;
};
