import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { workspacesCreateSchema, workspacesUpdateSchema } from "../schemas";
import {
  DATABASE_ID,
  MEMBERS_ID,
  STORAGE_BUCKET_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { MEMBER_ROLE, Workspace } from "../type";
import { generateRandomCharacters, generateRandomColor } from "@/lib/utils";
import { z } from "zod";
import { getMember } from "@/features/members/queries";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TASK_STATUS } from "@/features/tasks/type";
import { Member } from "@/features/members/type";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
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
  .get(
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

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (!workspace) {
        return c.json(
          {
            success: false,
            message: "Workspace not found",
            data: null,
          },
          400
        );
      }

      return c.json({
        success: true,
        message: "",
        data: workspace,
      });
    }
  )
  .post(
    "/",
    zValidator("form", workspacesCreateSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, imageUrl } = c.req.valid("form");

      const imageUpload: {
        imageUploadUrl: string | undefined;
        fileId: string | undefined;
      } = {
        imageUploadUrl: "",
        fileId: "",
      };

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

        imageUpload.imageUploadUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
        imageUpload.fileId = file.$id;
      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: imageUpload.imageUploadUrl,
          fileId: imageUpload.fileId,
          inviteCode: generateRandomCharacters(6),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MEMBER_ROLE.ADMIN,
        color: generateRandomColor(),
      });

      return c.json({
        success: true,
        message: "Successfully created workspace",
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

      const member = await getMember(databases, workspaceId, user.$id);

      if (!member || member?.role !== "ADMIN") {
        return c.json(
          {
            success: false,
            message: "Unauthorized",
            data: null,
          },
          401
        );
      }

      const imageUpload: {
        imageUploadUrl: string | undefined;
        fileId: string | undefined;
      } = {
        imageUploadUrl: "",
        fileId: "",
      };

      const existWorkspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (!existWorkspace) {
        return c.json(
          {
            success: false,
            message: "Workspace not found to update",
            data: null,
          },
          404
        );
      }

      if (imageUrl instanceof File) {
        if (existWorkspace.fileId) {
          await storage.deleteFile(STORAGE_BUCKET_ID, existWorkspace.fileId);
        }

        const file = await storage.createFile(
          STORAGE_BUCKET_ID,
          ID.unique(),
          imageUrl
        );

        const arrayBuffer = await storage.getFilePreview(
          STORAGE_BUCKET_ID,
          file.$id
        );

        imageUpload.imageUploadUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
        imageUpload.fileId = file.$id;
      } else {
        if (existWorkspace.fileId) {
          await storage.deleteFile(STORAGE_BUCKET_ID, existWorkspace.fileId);
        }

        imageUpload.imageUploadUrl = imageUrl;
      }

      const updatedWorkspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: imageUpload.imageUploadUrl || null,
          fileId: imageUpload.fileId || null,
        }
      );

      return c.json(
        {
          success: true,
          message: "Successfully update the workspace",
          data: updatedWorkspace,
        },
        200
      );
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
      const storage = c.get("storage");
      const { workspaceId } = c.req.valid("param");

      const member = await getMember(databases, workspaceId, user.$id);

      if (!member || member?.role !== "ADMIN") {
        return c.json(
          {
            success: false,
            message: "Unauthorized",
          },
          401
        );
      }

      const existWorkspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (!existWorkspace) {
        return c.json(
          {
            success: false,
            message: "Workspace not found to delete",
            data: null,
          },
          404
        );
      }

      // Delete the workspace
      await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

      if (existWorkspace.fileId) {
        await storage.deleteFile(STORAGE_BUCKET_ID, existWorkspace.fileId);
      }

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
        return c.json(
          {
            success: false,
            message: "Unauthorized",
            data: null,
          },
          401
        );
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
        message: "Successfully reset invitation code",
        data: workspace,
      });
    }
  )
  .post(
    "/:workspaceId/join/:inviteCode",
    zValidator(
      "param",
      z.object({
        workspaceId: z.string(),
        inviteCode: z.string(),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId, inviteCode } = c.req.valid("param");

      const workspace = await databases.getDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (!workspace) {
        return c.json(
          {
            success: false,
            message: "No workspace found",
            data: null,
          },
          404
        );
      }

      if (workspace.inviteCode !== inviteCode) {
        return c.json(
          {
            success: false,
            message: "Incorrect invitation code to join the workspace",
            data: null,
          },
          400
        );
      }

      const member = await getMember(databases, workspaceId, user.$id);

      if (member) {
        return c.json(
          {
            success: false,
            message: "You already the member of this workspace",
            data: null,
          },
          400
        );
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspaceId,
        role: MEMBER_ROLE.MEMBER,
        color: generateRandomColor(),
      });

      return c.json({
        success: true,
        message: "Successfully joined the workspace",
        data: workspace,
      });
    }
  )
  .get(
    "/:workspaceId/analytics",
    zValidator(
      "param",
      z.object({
        workspaceId: z.string(),
      })
    ),
    zValidator(
      "query",
      z.object({
        memberId: z.string().optional(),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("param");
      const { memberId } = c.req.valid("query");

      let member: Member | null = null;

      // If memberId is give that mean viewing member profile
      if (memberId) {
        member = await databases.getDocument<Member>(
          DATABASE_ID,
          MEMBERS_ID,
          memberId
        );
      } else {
        // For authenticated logined user
        member = await getMember(databases, workspaceId, user.$id);
      }

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
          Query.equal("workspaceId", workspaceId),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );

      const lastMonthTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
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
          Query.equal("workspaceId", workspaceId),
          Query.equal("assigneeId", member.$id),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );

      const lastMonthAssignedTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
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
          Query.equal("workspaceId", workspaceId),
          Query.notEqual("status", TASK_STATUS.DONE),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );

      const lastMonthIncompleteTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
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
          Query.equal("workspaceId", workspaceId),
          Query.equal("status", TASK_STATUS.DONE),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        ]
      );

      const lastMonthCompleteTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
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
          Query.equal("workspaceId", workspaceId),
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
          Query.equal("workspaceId", workspaceId),
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
        message: "Successfully get the project analytics",
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
  );

export default app;
