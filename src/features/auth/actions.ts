"use server";

import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { AUTH_COOKIE } from "./constants";

export const getCurrent = async () => {
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

    return await account.get();
  } catch {
    return null;
  }
};
