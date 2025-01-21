import { Models } from "node-appwrite";

export type Member = Models.Document & {
  memberId: string;
  workspaceId: string;
  role: "ADMIN" | "MEMBER";
};
