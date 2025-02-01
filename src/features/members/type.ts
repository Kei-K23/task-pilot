import { Models } from "node-appwrite";
import { MEMBER_ROLE } from "../workspaces/type";

export type Member = Models.Document & {
  userId: string;
  workspaceId: string;
  role: MEMBER_ROLE;
  color: string;
};

export type MemberWithUserData = Member & {
  name: string;
  email: string;
};
