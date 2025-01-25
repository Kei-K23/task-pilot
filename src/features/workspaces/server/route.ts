import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { workspacesCreateSchema, workspacesUpdateSchema } from "../schemas";
import {
  DATABASE_ID,
  MEMBERS_ID,
  STORAGE_BUCKET_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { MEMBER_ROLE } from "../type";
import { generateRandomCharacters } from "@/lib/utils";
import { z } from "zod";
import { getMember } from "@/features/members/queries";

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
  )
  .patch(
    "/:workspaceId",
    zValidator(
      "param",
      z.object({
        workspaceId: z.string(),
      })
    ),
    zValidator("form", workspacesUpdateSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("param");
      const { name, imageUrl } = c.req.valid("form");

      let imageUploadUrl: string | undefined;
      const member = await getMember(databases, workspaceId, user.$id);

      if (!member || member?.role !== "ADMIN") {
        return c.json({
          success: false,
          message: "Unauthorized",
        });
      }

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
      // TODO: Delete the previous old uploaded image
      await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
        name,
        imageUrl: imageUploadUrl || null,
      });

      return c.json({
        success: true,
        message: "Successfully update the workspace",
      });
    }
  )
  .delete(
    "/:workspaceId",
    zValidator(
      "param",
      z.object({
        workspaceId: z.string(),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("param");

      const member = await getMember(databases, workspaceId, user.$id);

      if (!member || member?.role !== "ADMIN") {
        return c.json({
          success: false,
          message: "Unauthorized",
        });
      }
      // Delete the workspace
      await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

      // Delete the members that related to workspace

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

      if (members.total !== 0) {
        members.documents.forEach(async (member) => {
          await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, member.$id);
        });
      }
      // TODO delete also other related data with workspace
      return c.json({
        success: true,
        message: "Successfully deleted the workspace",
      });
    }
  )
  .post(
    "/:workspaceId/reset-invite-code",
    zValidator(
      "param",
      z.object({
        workspaceId: z.string(),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("param");

      const member = await getMember(databases, workspaceId, user.$id);

      if (!member || member?.role !== "ADMIN") {
        return c.json({
          success: false,
          message: "Unauthorized",
          data: null,
        });
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          inviteCode: generateRandomCharacters(6),
        }
      );

      return c.json({
        success: true,
        message: "Success",
        data: workspace,
      });
    }
  );

export default app;
