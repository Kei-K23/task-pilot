import { Models } from "node-appwrite";
import { Project } from "../projects/type";
import { MemberWithUserData } from "../members/type";

export interface TaskCalendarEventCard {
  $id: string;
  title: string;
  status: TASK_STATUS;
  start: Date;
  end: Date;
  assignee: MemberWithUserData;
  project: Project;
}

export interface PositionedTask {
  $id: string;
  status: TASK_STATUS;
  position: number;
}

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
  assignee: MemberWithUserData;
  position: number;
  relatedTasks?: Task[];
};
