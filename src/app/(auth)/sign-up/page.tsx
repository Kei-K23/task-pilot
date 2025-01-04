import { getCurrent } from "@/features/auth/actions";
import SignUpCard from "@/features/auth/components/sign-up-card";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const user = await getCurrent();
  if (user) {
    return redirect("/");
  }

  return <SignUpCard />;
}
