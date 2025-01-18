"use server";

import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";
import { AUTH_COOKIE } from "../auth/constants";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { Workspace } from "./type";

export const getWorkspaces = async () => {
  try {
    const sessionClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const cookie = await cookies();
    const session = cookie.get(AUTH_COOKIE);

    if (!session) {
      return null;
    }

    // Set session to App write Client
    sessionClient.setSession(session.value);

    const account = new Account(sessionClient);
    const databases = new Databases(sessionClient);
    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("memberId", user.$id),
    ]);

    if (members.total === 0) {
      return null;
    }

    const workspaceIds = members.documents.map((m) => m.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return workspaces;
  } catch {
    return null;
  }
};

export const getWorkspaceById = async (workspaceId: string) => {
  try {
    const sessionClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const cookie = await cookies();
    const session = cookie.get(AUTH_COOKIE);

    if (!session) {
      return null;
    }

    // Set session to App write Client
    sessionClient.setSession(session.value);

    const account = new Account(sessionClient);
    const databases = new Databases(sessionClient);
    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("memberId", user.$id),
      Query.equal("workspaceId", workspaceId),
    ]);

    if (members.total === 0) {
      return null;
    }

    // TODO: Check do i need to protect only for admin user accept
    // if (members.documents[0].role !== "ADMIN") {
    //   return null;
    // }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return workspace;
  } catch {
    return null;
  }
};
