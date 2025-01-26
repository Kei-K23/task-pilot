import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.members)["$get"]>;
type RequestType = InferRequestType<(typeof client.api.members)["$get"]>;

export const useGetMembers = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ query }) => {
      const res = await client.api.members.$get({ query });

      if (!res.ok) {
        const resData = await res.json();
        return resData;
      }

      return await res.json();
    },
  });

  return mutation;
};
