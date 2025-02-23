"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const btn =
    pathname === "/sign-in"
      ? { name: "Sign Up", link: "/sign-up" }
      : { name: "Sign In", link: "/sign-in" };

  return (
    <nav className="max-w-5xl mx-auto">
      <div className="px-4 flex items-center justify-between gap-x-4 py-4">
        <Link href={"/"} className="flex items-center gap-x-2">
          <Image src={"/icons/icon.png"} alt="icon" width={30} height={30} />
          TaskPilot
        </Link>

        <Link href={btn.link}>
          <Button variant={"outline"} className="font-bold">
            {btn.name}
          </Button>
        </Link>
      </div>
    </nav>
  );
}
