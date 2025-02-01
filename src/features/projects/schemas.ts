import { z } from "zod";

export const projectCreateSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  workspaceId: z.string().trim().min(1, "Required"),
  imageUrl: z
    .union([
      z.instanceof(File),
      z.string().transform((v) => (v === "" ? undefined : v)),
    ])
    .optional(),
});

export const projectUpdateSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  workspaceId: z.string().trim().min(1, "Required"),
  imageUrl: z
    .union([
      z.instanceof(File),
      z.string().transform((v) => (v === "" ? undefined : v)),
    ])
    .optional(),
});
