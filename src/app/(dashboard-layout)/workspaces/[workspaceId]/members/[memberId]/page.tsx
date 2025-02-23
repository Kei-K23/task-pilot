import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import MemberIdClientPage from "./client";

export default async function MemberIdPage() {
  const user = await getCurrent();

  if (!user) {
    return redirect("/sign-in");
  }

  return <MemberIdClientPage />;
}
