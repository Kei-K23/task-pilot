import { useParams } from "next/navigation";

export const useGetProjectIdParam = (): string => {
  const { projectId } = useParams();
  return projectId as string;
};
