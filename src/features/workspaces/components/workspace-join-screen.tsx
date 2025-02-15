"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetInviteCodeParam } from "../hooks/use-get-invite-code-param";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTPGroup,
  InputOTPSlot,
  InputOTP,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WorkspaceJoinScreenProps {
  workspaceId: string;
  workspaceName: string;
}

export default function WorkspaceJoinScreen({
  workspaceId,
  workspaceName,
}: WorkspaceJoinScreenProps) {
  const router = useRouter();
  const inviteCode = useGetInviteCodeParam();
  const { mutate, isPending } = useJoinWorkspace();

  const handleJoinWorkspace = async () => {
    mutate(
      {
        param: {
          workspaceId,
          inviteCode: inviteCode,
        },
      },
      {
        onSuccess: ({ data, message }) => {
          toast.success(message);
          router.push(`/workspaces/${data?.$id}`);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      }
    );
  };

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle>
          You have invited to join &quot;{workspaceName}&quot; workspace
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            defaultValue={inviteCode}
            disabled
            className="pointer-events-none"
          >
            <InputOTPGroup>
              {inviteCode.split("").map((s, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  defaultValue={s}
                  className="pointer-events-none size-14 text-lg font-bold"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button
            disabled={isPending}
            variant={"secondary"}
            onClick={() => {
              router.push("/");
            }}
          >
            Cancel
          </Button>
          <Button disabled={isPending} onClick={handleJoinWorkspace}>
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
