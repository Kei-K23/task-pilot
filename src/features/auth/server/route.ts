import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../schemas";

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), (c) => {
    const { email, password } = c.req.valid("json");
    console.log(email, password);

    return c.json({
      email,
      password,
    });
  })
  .post("/register", zValidator("json", registerSchema), (c) => {
    const { email, password } = c.req.valid("json");

    return c.json({
      email,
      password,
    });
  });

export default app;
