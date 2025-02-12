"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Task } from "../type";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import MemberAvatar from "@/features/members/components/member-avatar";
import TaskDate from "./task-date";
import { formatEnumCase } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import TaskAction from "./task-action";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "projectId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;

      return (
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            imageUrl={project.imageUrl}
            className="size-7"
            showName={false}
          />
          <span>{project.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "assigneeId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;

      return (
        <div className="flex items-center gap-x-2">
          <MemberAvatar
            name={assignee.name}
            color={assignee.color}
            className="size-7"
          />
          <span>{assignee.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return <p className="line-clamp-2">{row.original.description}</p>;
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <TaskDate dueDate={row.original.dueDate} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            (row.original.status as
              | "default"
              | "secondary"
              | "destructive"
              | "outline") ?? "default"
          }
        >
          {formatEnumCase(row.original.status)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <TaskAction task={row.original} />;
    },
  },
];
