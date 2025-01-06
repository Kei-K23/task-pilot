import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { workspacesCreateSchema } from "../schemas";
import {
  DATABASE_ID,
  MEMBERS_ID,
  STORAGE_BUCKET_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { MEMBER_ROLE } from "../type";
import { generateRandomCharacters } from "@/lib/utils";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("memberId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({
        data: { documents: [], total: 0 },
      });
    }

    const workspaceIds = members.documents.map((m) => m.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({
      data: workspaces,
    });
  })
  .post(
    "/",
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
          inviteCode: generateRandomCharacters(6),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        memberId: user.$id,
        workspaceId: workspace.$id,
        role: MEMBER_ROLE.ADMIN,
      });

      return c.json({
        data: workspace,
      });
    }
  );

export default app;
