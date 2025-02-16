import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMember } from "../queries";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";
import { MEMBER_ROLE } from "@/features/workspaces/type";
import { MemberWithUserData } from "../type";
import { extractNameFromEmail } from "@/lib/utils";

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
        Query.orderAsc("role"),
        Query.orderDesc("$createdAt"),
      ]);

      const populateMemberWithUserData = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name || extractNameFromEmail(user.email),
            email: user.email,
            userId: member.userId,
            workspaceId: member.workspaceId,
            role: member.role,
            color: member.color,
          } satisfies MemberWithUserData;
        })
      );

      return c.json({
        success: true,
        message: "Success",
        data: populateMemberWithUserData,
      });
    }
  )
  .get(
    "/current-member",
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

      const populatedMember = {
        ...member,
        name: user.name || extractNameFromEmail(user.email),
        email: user.email,
        userId: member.userId,
        workspaceId: member.workspaceId,
        role: member.role,
        color: member.color,
      } satisfies MemberWithUserData;

      return c.json({
        success: true,
        message: "Success",
        data: populatedMember,
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
        memberId
      );

      const currentMember = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [
          Query.equal("userId", user.$id),
          Query.equal("workspaceId", workspaceId),
        ]
      );

      if (!member || currentMember.total === 0) {
        return c.json(
          {
            success: false,
            message: "Unauthorized",
            data: null,
          },
          401
        );
      }

      const isAdmin = currentMember.documents[0].role === MEMBER_ROLE.ADMIN;
      const isCurrentUser = user.$id === member.userId;

      // Non-admin members can only leave, not kick others
      if (!isAdmin && !isCurrentUser) {
        return c.json(
          {
            success: false,
            message: "Only admins can remove other members",
            data: null,
          },
          403
        );
      }

      // Admins cannot delete themselves
      if (isAdmin && isCurrentUser) {
        return c.json(
          {
            success: false,
            message: "Admins cannot delete themselves",
            data: null,
          },
          400
        );
      }

      await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

      return c.json({
        success: true,
        message: isCurrentUser
          ? "Successfully left the workspace"
          : "Successfully removed the member",
        data: {
          workspaceId,
        },
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

      const currentMemberList = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("userId", user.$id),
        ]
      );

      if (currentMemberList.total === 0) {
        return c.json(
          {
            success: false,
            message: "Unauthorized",
            data: null,
          },
          401
        );
      }

      const member = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const currentMember = currentMemberList.documents[0];

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

      if (currentMember.role !== MEMBER_ROLE.ADMIN) {
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
        message: "Successfully change the member role",
        data: updatedMember,
      });
    }
  );

export default app;
