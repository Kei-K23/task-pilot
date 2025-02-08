import { z } from "zod";
import { TASK_STATUS } from "./type";

export const taskCreateSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  assigneeId: z.string().trim().min(1, "Required"),
  description: z.string().trim().optional(),
  dueDate: z.coerce.date(),
  status: z.nativeEnum(TASK_STATUS, { required_error: "Required" }),
});
