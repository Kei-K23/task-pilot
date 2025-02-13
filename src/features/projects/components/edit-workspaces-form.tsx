"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
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
import { projectUpdateSchema } from "../schemas";
import { toast } from "sonner";
import { useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "../type";
import { useUpdateProject } from "../api/use-update-project";
import { useGetWorkspaceIdParam } from "@/features/workspaces/hooks/use-get-workspace-param";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValue: Project;
}

export default function EditProjectForm({
  onCancel,
  initialValue,
}: EditProjectFormProps) {
  const workspaceId = useGetWorkspaceIdParam();
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject({ workspaceId });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof projectUpdateSchema>>({
    resolver: zodResolver(projectUpdateSchema),
    defaultValues: {
      name: initialValue.name,
      imageUrl: initialValue.imageUrl || "",
      workspaceId: initialValue.workspaceId,
    },
  });

  async function onSubmit(values: z.infer<typeof projectUpdateSchema>) {
    const finalValue = {
      ...values,
      imageUrl:
        values.imageUrl instanceof File
          ? values.imageUrl
          : initialValue.imageUrl,
    };

    mutate(
      {
        param: {
          projectId: initialValue.$id,
        },
        form: finalValue,
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          form.reset();
          router.push(
            `/workspaces/${workspaceId}/projects/${initialValue.$id}`
          );
        },
        onError: () => {
          toast.error("Failed to update project");
        },
      }
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("imageUrl", file);
    }
  };
  return (
    <Card className="mt-4">
      <CardHeader className="flex items-center flex-row gap-x-4">
        <CardTitle className="text-lg text-center">
          Edit &quot;{initialValue.name}&quot; Project
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              disabled={isPending}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isPending}
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      {field.value ? (
                        <div className="relative size-20 rounded-full">
                          <Image
                            alt="Logo"
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                      ) : (
                        <div>
                          <Avatar className="size-20">
                            <AvatarFallback>
                              <ImageIcon className="size-10 text-neutral-500" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">Project Icon</p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, SVG or JPEG, max 1MB
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        {field.value ? (
                          <Button
                            variant={"destructive"}
                            type="button"
                            size={"sm"}
                            className="mt-2"
                            disabled={isPending}
                            onClick={() => {
                              field.onChange("");
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          >
                            <Trash2 />
                          </Button>
                        ) : (
                          <Button
                            variant={"secondary"}
                            type="button"
                            size={"sm"}
                            className="mt-2"
                            disabled={isPending}
                            onClick={() => {
                              fileInputRef?.current?.click();
                            }}
                          >
                            <Upload />
                          </Button>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-3">
              {onCancel && (
                <Button
                  variant={"secondary-white"}
                  disabled={isPending}
                  type="button"
                  className="font-bold"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              <Button disabled={isPending} type="submit" className="font-bold">
                {isPending ? "Saving..." : "Save Project"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
