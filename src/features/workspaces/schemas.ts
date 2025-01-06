import { z } from "zod";

export const workspacesCreateSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  imageUrl: z
    .union([
      z.instanceof(File),
      z.string().transform((v) => (v === "" ? undefined : v)),
    ])
    .optional(),
});
