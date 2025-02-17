import { Models } from "node-appwrite";

export enum MEMBER_ROLE {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export type Workspace = Models.Document & {
  name: string;
  userId: string;
  imageUrl: string;
  fileId: string;
  inviteCode: string;
};
