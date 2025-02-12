import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["bulk-position-update"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["bulk-position-update"]["$post"]
>;

export const useBulkUpdateTasksPosition = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.tasks["bulk-position-update"]["$post"]({
        query: { workspaceId },
        json,
      });

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(
          errorBody.message || "Failed to bulk update the tasks position"
        );
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    },
  });

  return mutation;
};
