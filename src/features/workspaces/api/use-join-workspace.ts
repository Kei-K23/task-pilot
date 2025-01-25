import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["join"][":inviteCode"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["join"][":inviteCode"]["$post"]
>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.workspaces[":workspaceId"]["join"][
        ":inviteCode"
      ]["$post"]({
        param,
      });

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.message || "Failed to join workspace");
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });

  return mutation;
};
