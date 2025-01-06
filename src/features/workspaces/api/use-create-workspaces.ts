import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces.login)["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces.login)["$post"]
>;

export const useCreateWorkspaces = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const res = await client.api.workspaces.login.$post({ form });
      return await res.json();
    },
  });

  return mutation;
};
