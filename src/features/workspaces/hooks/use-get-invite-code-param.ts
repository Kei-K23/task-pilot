import { useParams } from "next/navigation";

export const useGetInviteCodeParam = (): string => {
  const { inviteCode } = useParams();
  return inviteCode as string;
};
