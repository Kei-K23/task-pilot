"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { taskCreateSchema } from "../schemas";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { Task, TASK_STATUS } from "../type";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import MemberAvatar from "@/features/members/components/member-avatar";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateTask } from "../api/use-update-task";

interface EditTaskFormProps {
  onCancel?: () => void;
  initValue: Task;
}

export default function EditTaskForm({
  onCancel,
  initValue,
}: EditTaskFormProps) {
  const queryClient = useQueryClient();
  const workspaceId = useGetWorkspaceIdParam();
  const { mutate, isPending } = useUpdateTask({ workspaceId });
  const form = useForm<z.infer<typeof taskCreateSchema>>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      name: initValue?.name,
      description: initValue?.description,
      assigneeId: initValue?.assigneeId,
      dueDate: new Date(initValue.dueDate),
      status: TASK_STATUS[initValue?.status as TASK_STATUS],
      projectId: initValue?.projectId,
      workspaceId,
    },
  });
  const { data: memberOptions, isLoading: memberOptionLoading } = useGetMembers(
    { workspaceId }
  );
  const { data: projectOptions, isLoading: projectOptionLoading } =
    useGetProjects({ workspaceId });

  const members = memberOptions?.data?.map((member) => ({
    id: member.$id,
    name: member.name,
    color: member.color,
  }));

  const projects = projectOptions?.documents?.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const isFetchingAssociatedDate = memberOptionLoading || projectOptionLoading;

  async function onSubmit(values: z.infer<typeof taskCreateSchema>) {
    mutate(
      {
        json: values,
        param: {
          taskId: initValue.$id,
        },
      },
      {
        onSuccess: ({ message, data }) => {
          toast.success(message);
          form.reset();

          queryClient.invalidateQueries({
            queryKey: ["tasks", values.workspaceId, data?.$id],
          });

          onCancel?.();
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      }
    );
  }

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-lg text-center">Edit the Task</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Enter task name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isPending}
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Due date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger disabled={isPending}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TASK_STATUS.BACKLOG}>
                        {TASK_STATUS.BACKLOG}
                      </SelectItem>
                      <SelectItem value={TASK_STATUS.IN_PROGRESS}>
                        {TASK_STATUS.IN_PROGRESS}
                      </SelectItem>
                      <SelectItem value={TASK_STATUS.IN_REVIEW}>
                        {TASK_STATUS.IN_REVIEW}
                      </SelectItem>
                      <SelectItem value={TASK_STATUS.TODO}>
                        {TASK_STATUS.TODO}
                      </SelectItem>
                      <SelectItem value={TASK_STATUS.DONE}>
                        {TASK_STATUS.DONE}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      placeholder="Enter task description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center gap-x-2">
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending || isFetchingAssociatedDate}
                    >
                      <FormControl>
                        <SelectTrigger
                          disabled={isPending || isFetchingAssociatedDate}
                        >
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members?.map?.((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar
                                name={member.name}
                                color={member.color}
                                className="size-8"
                              />
                              <span>{member.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Project</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending || isFetchingAssociatedDate}
                    >
                      <FormControl>
                        <SelectTrigger
                          disabled={isPending || isFetchingAssociatedDate}
                        >
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects?.map?.((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-x-2">
                              <ProjectAvatar
                                name={project.name}
                                imageUrl={project.imageUrl}
                                className="size-8"
                                showName={false}
                              />
                              <span>{project.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-3">
              {onCancel && (
                <Button
                  variant={"outline"}
                  disabled={isPending || isFetchingAssociatedDate}
                  type="button"
                  className="font-bold"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              <Button
                disabled={isPending || isFetchingAssociatedDate}
                type="submit"
                className="font-bold"
              >
                Save Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
