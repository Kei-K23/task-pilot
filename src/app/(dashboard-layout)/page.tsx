import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();

  if (!user) {
    return redirect("/sign-in");
  }

  return <div>This is home page</div>;
}
