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

interface WorkspaceJoinScreenProps {
  workspaceName: string;
}

export default function WorkspaceJoinScreen({
  workspaceName,
}: WorkspaceJoinScreenProps) {
  const inviteCode = useGetInviteCodeParam();

  return (
    <Card>
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
          <Button variant={"outline"}>Cancel</Button>
          <Button>Join</Button>
        </div>
      </CardContent>
    </Card>
  );
}
