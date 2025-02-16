"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { registerSchema } from "@/features/auth/schemas";
import { useRegister } from "@/features/auth/api/use-register";
import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";

export default function SignUpCard() {
  const { mutate, isPending } = useRegister();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof registerSchema>) {
    mutate({ json: values });
  }

  return (
    <Card className="max-w-xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-center">Sign Up</CardTitle>
        <CardDescription className="text-center">
          By signing up, you agree to our{" "}
          <span className="text-blue-500">Privacy Policy</span> and{" "}
          <span className="text-blue-500">Terms of Service</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    disabled={isPending}
                    placeholder="Enter username"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    disabled={isPending}
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input
                    disabled={isPending}
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    disabled={isPending}
                    type="password"
                    placeholder="Enter confirm password"
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
              Sign Up
            </Button>
          </form>
        </Form>
        <Separator className="w-full h-[1px] my-6" />
        <div className="space-y-4">
          <Button
            onClick={() => {
              signUpWithGoogle();
            }}
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
          <Link href={"/sign-in"} className="text-sm text-muted-foreground">
            Already have an account? Login here.
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
