import { useParams } from "next/navigation";

export const useGetWorkspaceIdParam = (): string => {
  const { workspaceId } = useParams();
  return workspaceId as string;
};
