import { z } from "zod";

export const workspacesCreateSchema = z.object({
  name: z.string().trim().min(1, "Required"),
});
