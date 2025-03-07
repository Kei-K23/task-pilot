"use client";

import {
  ArrowRight,
  CheckCircle,
  Github,
  Layers,
  LayoutDashboard,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Models } from "node-appwrite";
import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";

interface LandingScreenProps {
  initialUser: Models.User<Models.Preferences> | null;
  initialWorkspaces: Models.DocumentList<Models.Document> | null;
}

export default function LandingScreen({
  initialUser,
  initialWorkspaces,
}: LandingScreenProps) {
  const [user, setUser] = useState(initialUser);
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);

  useEffect(() => {
    (async () => {
      const user = await getCurrent();
      const workspaces = await getWorkspaces();

      if (user) {
        setUser(user);
      }
      if (workspaces) {
        setWorkspaces(workspaces);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Navigation */}
      <header className="border-b border-b-gray-200 dark:border-b-gray-800 fixed w-full bg-background bg-gray-300 dark:bg-gray-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-40 z-50">
        <div className="mx-auto container flex h-16 items-center justify-between">
          <Link href={"/"} className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-xl font-bold">TaskPilot</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/Kei-K23/task-pilot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            {user ? (
              <Link
                href={
                  !workspaces || workspaces?.total === 0
                    ? "/workspaces/create"
                    : `/workspaces/${workspaces?.documents[0].$id}`
                }
              >
                <Button>Go to Workspace</Button>
              </Link>
            ) : (
              <Link href={"/sign-in"}>
                <Button>Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 mt-28">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Open Source Project Management
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter max-w-3xl">
                Manage tasks and projects like a pro with TaskPilot
              </h1>
              <p className="text-muted-foreground md:text-xl max-w-[42rem]">
                A simple and minimal version of Jira that every developer will
                love. Navigate your tasks and projects with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 min-[400px]:gap-4">
                {user ? (
                  <Link
                    href={
                      !workspaces || workspaces?.total === 0
                        ? "/workspaces/create"
                        : `/workspaces/${workspaces?.documents[0].$id}`
                    }
                  >
                    <Button size={"lg"}>Go to Workspace</Button>
                  </Link>
                ) : (
                  <Link href={"/sign-in"}>
                    <Button size="lg" className="gap-1.5">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link
                  href={"https://github.com/Kei-K23/task-pilot"}
                  target="_blank"
                >
                  <Button size="lg" variant="outline">
                    View on GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="features" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                Powerful Features
              </h2>
              <p className="text-muted-foreground max-w-[42rem]">
                Everything you need to manage your projects efficiently
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Task Management</h3>
                <p className="text-muted-foreground">
                  Create, organize, and track tasks with customizable workflows
                  and priorities.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fast & Responsive</h3>
                <p className="text-muted-foreground">
                  Enjoy a lightning-fast experience with real-time updates and
                  responsive design.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Github className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Open Source</h3>
                <p className="text-muted-foreground">
                  Fully open source and customizable to fit your team&apos;s
                  specific needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                How TaskPilot Works
              </h2>
              <p className="text-muted-foreground max-w-[42rem]">
                Simple, intuitive, and designed for developers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Create Projects</h3>
                    <p className="text-muted-foreground">
                      Set up projects and invite team members to collaborate.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Manage Tasks</h3>
                    <p className="text-muted-foreground">
                      Create tasks, assign them, and track progress through
                      customizable workflows.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Track Progress</h3>
                    <p className="text-muted-foreground">
                      Monitor project progress with intuitive dashboards and
                      reports.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border shadow-sm">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  <Image src={"/dashboard-img.png"} alt="dashboard img" fill />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Pricing</h2>
              <p className="text-muted-foreground max-w-[42rem]">
                Free and open source forever
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 pt-8 text-center">
                  <h3 className="text-2xl font-bold">Open Source</h3>
                  <div className="mt-4 text-4xl font-bold">$0</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Kinda Free forever (Until free resource run out 🤧)
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Unlimited workspaces</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Unlimited projects</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Unlimited tasks</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Workspace members invitation</span>
                    </li>
                  </ul>
                  {user ? (
                    <Link
                      href={
                        !workspaces || workspaces?.total === 0
                          ? "/workspaces/create"
                          : `/workspaces/${workspaces?.documents[0].$id}`
                      }
                    >
                      <Button className="w-full">Go to Workspace</Button>
                    </Link>
                  ) : (
                    <Link href={"/sign-in"}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">
                Ready to streamline your workflow?
              </h2>
              <p className="max-w-[42rem]">
                Join thousands of developers who are already using TaskPilot to
                manage their projects.
              </p>
              {user ? (
                <Link
                  href={
                    !workspaces || workspaces?.total === 0
                      ? "/workspaces/create"
                      : `/workspaces/${workspaces?.documents[0].$id}`
                  }
                >
                  <Button size="lg" variant={"ghost"} className="mt-4">
                    Go to Workspace
                  </Button>
                </Link>
              ) : (
                <Link href={"/sign-in"}>
                  <Button size="lg" variant={"ghost"} className="mt-4">
                    Get Started Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            <p className="text-sm">© 2025 TaskPilot. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              href="https://github.com/Kei-K23/task-pilot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
