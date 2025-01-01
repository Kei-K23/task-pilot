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
  FormControl,
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

const formSchema = z.object({
  username: z
    .string()
    .min(6, {
      message: "Username must contain at least 6 characters",
    })
    .max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(6, {
      message: "Password must contain at least 6 characters",
    })
    .max(18),
  confirmPassword: z
    .string()
    .min(6, {
      message: "Confirm password must contain at least 6 characters",
    })
    .max(18),
});

export default function SignUpPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
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
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
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
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-bold">
              Sign Up
            </Button>
          </form>
        </Form>
        <Separator className="w-full h-[1px] my-6" />
        <div className="space-y-4">
          <Button variant={"outline"} className="w-full flex items-center">
            <Image
              src={"/icons/google.svg"}
              alt="google icon"
              width={20}
              height={20}
            />
            Continue with Google
          </Button>
          <Button variant={"outline"} className="w-full flex items-center">
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
