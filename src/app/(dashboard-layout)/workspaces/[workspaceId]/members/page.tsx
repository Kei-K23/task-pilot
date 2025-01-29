import { getCurrent } from "@/features/auth/queries";
import MemberListScreen from "@/features/members/components/member-list-screen";
import { redirect } from "next/navigation";

export default async function MemberPage() {
  const user = await getCurrent();
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="w-full mx-auto space-y-6">
      <MemberListScreen />
    </div>
  );
}
