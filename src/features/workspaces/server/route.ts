import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { workspacesCreateSchema } from "../schemas";
import { DATABASE_ID, STORAGE_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono().post(
  "/login",
  zValidator("form", workspacesCreateSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { name, imageUrl } = c.req.valid("form");

    let imageUploadUrl: string | undefined;

    if (imageUrl instanceof File) {
      const file = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        imageUrl
      );

      const arrayBuffer = await storage.getFilePreview(
        STORAGE_BUCKET_ID,
        file.$id
      );

      imageUploadUrl = `data:image/png;base64,${Buffer.from(
        arrayBuffer
      ).toString("base64")}`;
    }

    const workspace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageUrl: imageUploadUrl,
      }
    );

    return c.json({
      data: workspace,
    });
  }
);

export default app;
