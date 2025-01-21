"use server";

import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Databases, Query } from "node-appwrite";
import { Member } from "./type";

export const getMember = async (
  databases: Databases,
  workspaceId: string,
  userId: string
) => {
  try {
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("memberId", userId),
      Query.equal("workspaceId", workspaceId),
    ]);

    if (members.total === 0 || !members.documents[0]) {
      return null;
    }
    return members.documents[0] as Member;
  } catch {
    return null;
  }
};
