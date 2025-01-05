"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useCreateWorkspaces } from "../api/use-create-workspaces";
import { workspacesCreateSchema } from "../schemas";
import { toast } from "sonner";

interface CreateWorkspacesFormProps {
  onCancel?: () => void;
}

export default function CreateWorkspacesForm({
  onCancel,
}: CreateWorkspacesFormProps) {
  const { mutate, isPending } = useCreateWorkspaces();

  const form = useForm<z.infer<typeof workspacesCreateSchema>>({
    resolver: zodResolver(workspacesCreateSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof workspacesCreateSchema>) {
    mutate(
      { json: values },
      {
        onSuccess: () => {
          toast.success("Successfully created workspace");
          form.reset();
        },
        onError: () => {
          toast.error("Failed to create workspace");
        },
      }
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-center">Create a new Workspace</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isPending}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <Input placeholder="Enter workspace name" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-3">
              <Button
                variant={"secondary-white"}
                disabled={isPending}
                type="button"
                className="font-bold"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit" className="font-bold">
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
