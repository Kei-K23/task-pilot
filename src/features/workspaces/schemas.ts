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

export const workspacesUpdateSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  imageUrl: z
    .union([
      z.instanceof(File),
      z.string().transform((v) => (v === "" ? undefined : v)),
    ])
    .optional(),
});
