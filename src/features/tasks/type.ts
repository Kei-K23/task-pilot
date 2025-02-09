import { Models } from "node-appwrite";
import { Project } from "../projects/type";
import { Member } from "../members/type";

export enum TASK_STATUS {
  BACKLOG = "BACKLOG",
  IN_PROGRESS = "IN_PROGRESS",
  TODO = "TODO",
  DONE = "DONE",
  IN_REVIEW = "IN_REVIEW",
}

export type Task = Models.Document & {
  name: string;
  workspaceId: string;
  projectId: string;
  assigneeId: string;
  status: string;
  dueDate: string;
  description?: string;
  project: Project;
  assignee: Member;
};
