import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { TASK_STATUS } from "../type";

export default function useTasksFilterQuery() {
  return useQueryStates({
    projectId: parseAsString,
    assigneeId: parseAsString,
    status: parseAsStringEnum(Object.values(TASK_STATUS)),
    search: parseAsString,
    dueDate: parseAsString,
  });
}
