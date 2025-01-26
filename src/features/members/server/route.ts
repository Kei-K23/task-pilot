import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMember } from "../queries";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";
import { MEMBER_ROLE } from "@/features/workspaces/type";

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
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
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

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

      const populateMemberWithUserData = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      return c.json({
        success: true,
        message: "Success",
        data: populateMemberWithUserData,
      });
    }
  )
  .delete(
    "/:memberId",
    zValidator(
      "param",
      z.object({
        memberId: z.string(),
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
      const { memberId } = c.req.valid("param");
      const { workspaceId } = c.req.valid("query");

      const member = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId,
        [Query.equal("workspaceId", workspaceId)]
      );

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

      // Protecting from admin member delete their own account for admin
      if (user.$id === member.userId && member.role === MEMBER_ROLE.ADMIN) {
        return c.json(
          {
            success: false,
            message: "Admin member cannot delete",
            data: null,
          },
          400
        );
      }

      // Protecting from normal member delete other member
      if (user.$id !== member.userId && member.role !== MEMBER_ROLE.ADMIN) {
        return c.json(
          {
            success: false,
            message: "Unauthorized",
            data: null,
          },
          401
        );
      }

      await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

      return c.json({
        success: true,
        message: "Successfully delete the member account",
        data: null,
      });
    }
  )
  .patch(
    "/:memberId",
    zValidator(
      "param",
      z.object({
        memberId: z.string(),
      })
    ),
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    zValidator(
      "json",
      z.object({
        role: z.nativeEnum(MEMBER_ROLE),
      })
    ),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { memberId } = c.req.valid("param");
      const { workspaceId } = c.req.valid("query");
      const { role } = c.req.valid("json");

      const member = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId,
        [Query.equal("workspaceId", workspaceId)]
      );

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

      if (user.$id === member.userId && member.role === MEMBER_ROLE.ADMIN) {
        return c.json(
          {
            success: false,
            message: "Admin member cannot change their role",
            data: null,
          },
          400
        );
      }

      if (member.role !== MEMBER_ROLE.ADMIN) {
        return c.json(
          {
            success: false,
            message: "Unauthorized",
            data: null,
          },
          401
        );
      }

      const updatedMember = await databases.updateDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId,
        {
          role,
        }
      );

      return c.json({
        success: true,
        message: "Successfully delete the member account",
        data: updatedMember,
      });
    }
  );

export default app;
