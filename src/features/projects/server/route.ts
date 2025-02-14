import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { projectCreateSchema, projectUpdateSchema } from "../schemas";
import {
  DATABASE_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  STORAGE_BUCKET_ID,
  TASKS_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Project } from "../type";
import { getMember } from "@/features/members/queries";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TASK_STATUS } from "@/features/tasks/type";

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
  .get(
    "/:projectId/analysis",
    zValidator(
      "param",
      z.object({
        projectId: z.string(),
      })
    ),
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { projectId } = c.req.valid("param");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember(databases, workspaceId, user.$id);

      if (!member) {
        return c.json(
          {
            success: false,
            message: "Unauthorized",
            data: null,
          },
          401
        );
      }

      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const thisMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      const thisMonthTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );

      const lastMonthTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );

      const taskCount = thisMonthTasks.total;
      const taskDiff = taskCount - lastMonthTasks.total;

      const thisMonthAssignedTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.equal("assigneeId", member.$id),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );

      const lastMonthAssignedTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.equal("assigneeId", member.$id),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );

      const assignedTaskCount = thisMonthAssignedTasks.total;
      const assignedTaskDiff = assignedTaskCount - lastMonthAssignedTasks.total;

      const thisMonthIncompleteTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.notEqual("status", TASK_STATUS.DONE),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );

      const lastMonthIncompleteTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.notEqual("status", TASK_STATUS.DONE),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );

      const incompleteTaskCount = thisMonthIncompleteTasks.total;
      const incompleteTaskDiff =
        incompleteTaskCount - lastMonthIncompleteTasks.total;

      const thisMonthCompleteTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.equal("status", TASK_STATUS.DONE),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );

      const lastMonthCompleteTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.equal("status", TASK_STATUS.DONE),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );

      const completeTaskCount = thisMonthCompleteTasks.total;
      const completeTaskDiff = completeTaskCount - lastMonthCompleteTasks.total;

      const thisMonthOverdueTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.notEqual("status", TASK_STATUS.DONE),
          Query.lessThan("dueDate", now.toISOString()),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );

      const lastMonthOverdueTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("projectId", projectId),
          Query.notEqual("status", TASK_STATUS.DONE),
          Query.lessThan("dueDate", now.toISOString()),
          Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        ]
      );

      const overDueTaskCount = thisMonthOverdueTasks.total;
      const overDueTaskDiff = overDueTaskCount - lastMonthOverdueTasks.total;

      return c.json({
        success: true,
        message: "Successfully get the project analysis",
        data: {
          taskCount,
          taskDiff,
          assignedTaskCount,
          assignedTaskDiff,
          incompleteTaskCount,
          incompleteTaskDiff,
          completeTaskCount,
          completeTaskDiff,
          overDueTaskCount,
          overDueTaskDiff,
        },
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
      const { name, imageUrl, workspaceId } = c.req.valid("form");

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
      } else {
        imageUploadUrl = imageUrl;
      }
      // TODO: Delete the previous old uploaded image
      await databases.updateDocument(DATABASE_ID, PROJECTS_ID, projectId, {
        name,
        imageUrl: imageUploadUrl || null,
        workspaceId,
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
