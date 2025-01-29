import { Models } from "node-appwrite";

export type Member = Models.Document & {
  userId: string;
  workspaceId: string;
  role: "ADMIN" | "MEMBER";
  color: string;
};

export type MemberWithUserData = Member & {
  name: string;
  email: string;
};
