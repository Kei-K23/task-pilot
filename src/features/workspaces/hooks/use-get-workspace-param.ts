import { useParams } from "next/navigation";

export const useGetWorkspaceParam = (): string => {
  const { workspaceId } = useParams();
  return workspaceId as string;
};
