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
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { loginSchema } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/api/use-login";
import { signUpWithGithub } from "@/lib/oauth";

export default function SignInCard() {
  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate({ json: values });
  }

  return (
    <Card className="max-w-xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-center">Welcome Back</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isPending}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isPending}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full font-bold"
            >
              Login
            </Button>
          </form>
        </Form>
        <Separator className="w-full h-[1px] my-6" />
        <div className="space-y-4">
          <Button
            disabled={isPending}
            variant={"outline"}
            className="w-full flex items-center"
          >
            <Image
              src={"/icons/google.svg"}
              alt="google icon"
              width={20}
              height={20}
            />
            Continue with Google
          </Button>
          <Button
            onClick={() => {
              signUpWithGithub();
            }}
            disabled={isPending}
            variant={"outline"}
            className="w-full flex items-center"
          >
            <Image
              src={"/icons/github.svg"}
              alt="google icon"
              width={20}
              height={20}
            />
            Continue with GitHub
          </Button>
        </div>
        <div className="flex items-center justify-center mt-8">
          <Link href={"/sign-up"} className="text-sm text-muted-foreground">
            Don&apos;t have an account? Create account here.
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
