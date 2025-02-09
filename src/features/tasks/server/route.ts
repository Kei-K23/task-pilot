import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { taskCreateSchema, taskUpdateSchema } from "../schemas";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { getMember } from "@/features/members/queries";
import { z } from "zod";
import { Task, TASK_STATUS } from "../type";
import { createAdminClient } from "@/lib/appwrite";
import { Project } from "@/features/projects/type";
import { Member } from "@/features/members/type";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TASK_STATUS).nullish(),
        dueDate: z.string().nullish(),
        search: z.string().nullish(),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId, projectId, assigneeId, status, dueDate, search } =
        c.req.valid("query");

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

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        query.push(Query.equal("projectId", projectId));
      }

      if (assigneeId) {
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (status) {
        query.push(Query.equal("status", status));
      }

      if (dueDate) {
        query.push(Query.equal("dueDate", dueDate));
      }

      if (search) {
        query.push(Query.search("name", search));
      }

      // Get the tasks according to query filter
      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      );

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.filter(
          (project) => project.$id === task.projectId
        )?.[0] as unknown as Project;

        const assignee = assignees.filter(
          (assignee) => assignee.$id === task.assigneeId
        )?.[0] as unknown as Member;

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        data: populatedTasks,
      });
    }
  )
  .get(
    "/:taskId",
    zValidator(
      "param",
      z.object({
        taskId: z.string(),
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
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");

      const { taskId } = c.req.valid("param");
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

      // Get the tasks according to query filter
      const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const project = await databases.getDocument(
        DATABASE_ID,
        PROJECTS_ID,
        task.projectId
      );

      const memberData = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        task.assigneeId
      );

      const memberUser = await users.get(memberData.userId);

      const assignee = {
        ...member,
        name: memberUser.name,
        email: memberUser.email,
      };

      return c.json({
        data: {
          ...task,
          project,
          assignee,
        },
      });
    }
  )
  .post(
    "/",
    zValidator("json", taskCreateSchema),
    sessionMiddleware,
    async (c) => {
      const {
        workspaceId,
        name,
        projectId,
        assigneeId,
        status,
        dueDate,
        description,
      } = c.req.valid("json");
      const databases = c.get("databases");
      const user = c.get("user");

      const member = getMember(databases, workspaceId, user.$id);

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

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.equal("projectId", projectId),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );

      const newPosition =
        highestPositionTask.total === 0
          ? 1000
          : highestPositionTask.documents[0].position + 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          workspaceId,
          projectId,
          assigneeId,
          description,
          dueDate,
          status,
          position: newPosition,
        }
      );

      return c.json({
        success: true,
        message: "Successfully created new task",
        data: task,
      });
    }
  )
  .patch(
    "/:taskId",
    zValidator(
      "param",
      z.object({
        taskId: z.string(),
      })
    ),
    zValidator("json", taskUpdateSchema),
    sessionMiddleware,
    async (c) => {
      const {
        workspaceId,
        name,
        projectId,
        assigneeId,
        status,
        dueDate,
        description,
      } = c.req.valid("json");
      const { taskId } = c.req.valid("param");
      const databases = c.get("databases");
      const user = c.get("user");

      const member = getMember(databases, workspaceId, user.$id);

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

      const task = await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          workspaceId,
          projectId,
          assigneeId,
          description,
          dueDate,
          status,
        }
      );

      return c.json({
        success: true,
        message: "Successfully updated the task",
        data: task,
      });
    }
  )
  .patch(
    "/:taskId",
    zValidator(
      "param",
      z.object({
        taskId: z.string(),
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
      const { taskId } = c.req.valid("param");
      const { workspaceId } = c.req.valid("query");
      const databases = c.get("databases");
      const user = c.get("user");

      const member = getMember(databases, workspaceId, user.$id);

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

      await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

      return c.json({
        success: true,
        message: "Successfully deleted the task",
        data: null,
      });
    }
  );

export default app;
