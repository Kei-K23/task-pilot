"use server";

import { AUTH_COOKIE } from "@/features/auth/constants";
import { cookies } from "next/headers";
import { Client, Account, Databases } from "node-appwrite";

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createSessionClient() {
  const sessionClient = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const cookie = await cookies();
  const session = cookie.get(AUTH_COOKIE);

  if (!session || !session.value) {
    throw new Error("Unauthorized");
  }

  // Set session to App write Client
  sessionClient.setSession(session.value);

  return {
    get account() {
      return new Account(sessionClient);
    },
    get databases() {
      return new Databases(sessionClient);
    },
  };
}
