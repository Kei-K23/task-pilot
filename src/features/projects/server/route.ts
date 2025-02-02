import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { projectCreateSchema, projectUpdateSchema } from "../schemas";
import {
  DATABASE_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  STORAGE_BUCKET_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Project } from "../type";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const { workspaceId } = c.req.valid("query");
      const databases = c.get("databases");
      const user = c.get("user");

      const memberList = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", workspaceId),
        ]
      );

      if (memberList.total === 0) {
        return c.json(
          {
            success: false,
            message: "Unauthorized",
            data: null,
          },
          401
        );
      }

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
      );

      return c.json({
        data: projects,
      });
    }
  )
  .post(
    "/",
    zValidator("form", projectCreateSchema),
    sessionMiddleware,
    async (c) => {
      const { name, imageUrl, workspaceId } = c.req.valid("form");
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const memberList = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", workspaceId),
        ]
      );

      if (memberList.total === 0) {
        return c.json(
          {
            success: false,
            message: "Unauthorized",
            data: null,
          },
          401
        );
      }

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

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          workspaceId,
          imageUrl: imageUploadUrl,
        }
      );

      return c.json({
        data: project,
      });
    }
  )
  .patch(
    "/:projectId",
    zValidator(
      "param",
      z.object({
        projectId: z.string(),
      })
    ),
    zValidator("form", projectUpdateSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const { projectId } = c.req.valid("param");
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
      // TODO: Delete the previous old uploaded image
      await databases.updateDocument(DATABASE_ID, PROJECTS_ID, projectId, {
        name,
        imageUrl: imageUploadUrl || null,
      });

      return c.json({
        success: true,
        message: "Successfully update the project",
      });
    }
  )
  .delete(
    "/:projectId",
    zValidator(
      "param",
      z.object({
        projectId: z.string(),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const { projectId } = c.req.valid("param");

      await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

      // TODO: check do i need to delete other data related to project

      return c.json({
        success: true,
        message: "Successfully deleted the project",
      });
    }
  );

export default app;
