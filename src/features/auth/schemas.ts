import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, {
      message: "Password must contain at least 6 characters",
    })
    .max(18),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(6, {
      message: "Username must contain at least 6 characters",
    })
    .max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(6, {
      message: "Password must contain at least 6 characters",
    })
    .max(18),
  confirmPassword: z
    .string()
    .min(6, {
      message: "Confirm password must contain at least 6 characters",
    })
    .max(18),
});
