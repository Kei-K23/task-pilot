import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useCurrent = () => {
  const query = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const res = await client.api.auth.current.$get();
      console.log(res);

      if (!res.ok) {
        return null;
      }

      const { data } = await res.json();
      return data;
    },
  });

  return query;
};
