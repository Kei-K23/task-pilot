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
import { workspacesUpdateSchema } from "../schemas";
import { toast } from "sonner";
import { useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ImageIcon, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpdateWorkspace } from "../api/use-update-workspaces";
import { Workspace } from "../type";

interface EditWorkspacesFormProps {
  onCancel?: () => void;
  initialValue: Workspace;
}

export default function EditWorkspacesForm({
  onCancel,
  initialValue,
}: EditWorkspacesFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof workspacesUpdateSchema>>({
    resolver: zodResolver(workspacesUpdateSchema),
    defaultValues: {
      name: initialValue.name,
      imageUrl: initialValue.imageUrl || "",
    },
  });

  async function onSubmit(values: z.infer<typeof workspacesUpdateSchema>) {
    const finalValue = {
      ...values,
      imageUrl: values.imageUrl instanceof File ? values.imageUrl : "",
    };
    console.log(finalValue);

    mutate(
      {
        param: {
          workspaceId: initialValue.$id,
        },
        form: finalValue,
      },
      {
        onSuccess: () => {
          toast.success("Successfully updated workspace");
          form.reset();
          router.push(`/workspaces/${initialValue.$id}`);
        },
        onError: () => {
          toast.error("Failed to update workspace");
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
        <Button
          variant={"ghost"}
          onClick={() => {
            router.push(`/workspaces/${initialValue.$id}`);
          }}
        >
          <ChevronLeft />
          Back
        </Button>
        <CardTitle className="text-lg text-center">
          Edit &quot;{initialValue.name}&quot; workspace
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
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter workspace name" {...field} />
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
                        <p className="font-semibold">Workspace Icon</p>
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
                Save Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
