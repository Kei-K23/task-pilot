import { Models } from "node-appwrite";

export type Project = Models.Document & {
  name: string;
  imageUrl: string;
  fileId: string;
  workspaceId: string;
};

export type ProjectAnalyticsResponse = {
  taskCount: number;
  taskDiff: number;
  assignedTaskCount: number;
  assignedTaskDiff: number;
  incompleteTaskCount: number;
  incompleteTaskDiff: number;
  completeTaskCount: number;
  completeTaskDiff: number;
  overDueTaskCount: number;
  overDueTaskDiff: number;
};
