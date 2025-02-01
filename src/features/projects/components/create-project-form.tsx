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
import { toast } from "sonner";
import { useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { projectCreateSchema } from "../schemas";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export default function CreateProjectForm({
  onCancel,
}: CreateProjectFormProps) {
  const { mutate, isPending } = useCreateProject();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof projectCreateSchema>>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof projectCreateSchema>) {
    const finalValue = {
      ...values,
      imageUrl: values.imageUrl instanceof File ? values.imageUrl : "",
    };
    mutate(
      { form: finalValue },
      {
        onSuccess: () => {
          toast.success("Successfully created new project");
          form.reset();
        },
        onError: () => {
          toast.error("Failed to create new project");
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
    <Card className="mt-4 border-none">
      <CardHeader>
        <CardTitle className="text-lg text-center">
          Create a new Project
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
                        disabled={isPending}
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
                        disabled={isPending}
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
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
