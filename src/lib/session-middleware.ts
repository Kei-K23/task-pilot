import { AUTH_COOKIE } from "@/features/auth/constants";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import {
  Account,
  Client,
  Databases,
  Models,
  Storage,
  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StorageType,
  type Users as UsersType,
} from "node-appwrite";

type AdditionalType = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalType>(
  async (c, next) => {
    const sessionClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = getCookie(c, AUTH_COOKIE);
    if (!session) {
      return c.json({ error: "Unauthorized" });
    }

    // Set session to App write Client
    sessionClient.setSession(session);

    const account = new Account(sessionClient);
    const databases = new Databases(sessionClient);
    const storage = new Storage(sessionClient);

    const user = await account.get();

    c.set("account", account);
    c.set("databases", databases);
    c.set("storage", storage);
    c.set("user", user);

    await next();
  }
);
