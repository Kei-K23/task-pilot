import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import TaskIdClientPage from "./client";

export default async function TaskIdPage() {
  const user = await getCurrent();

  if (!user) {
    return redirect("/sign-in");
  }

  return <TaskIdClientPage />;
}
