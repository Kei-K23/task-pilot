import { useParams } from "next/navigation";

export const useGetMemberIdParam = (): string => {
  const { memberId } = useParams();
  return memberId as string;
};
