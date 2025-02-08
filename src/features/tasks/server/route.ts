import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { taskCreateSchema } from "../schemas";
import { DATABASE_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { getMember } from "@/features/members/queries";

const app = new Hono().post(
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
      data: task,
    });
  }
);

export default app;
