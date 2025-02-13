import { useParams } from "next/navigation";

export default function useGetTaskIdParam() {
  const { taskId } = useParams();
  return taskId as string;
}
