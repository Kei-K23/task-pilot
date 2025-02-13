import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import TasksClientPage from "./client";

export default async function TasksPage() {
  const user = await getCurrent();

  if (!user) {
    return redirect("/sign-in");
  }

  return <TasksClientPage />;
}
