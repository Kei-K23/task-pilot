"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMembers } from "../api/use-get-members";
import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { useGetCurrentMember } from "../api/use-get-current-member";
import { useMemo } from "react";
import MemberListItem, { MemberListItemSkeleton } from "./member-list-item";

export default function MemberListScreen() {
  const workspaceId = useGetWorkspaceParam();

  const { data: currentMember, isLoading: currentMemberLoading } =
    useGetCurrentMember(workspaceId);
  const { data: membersList, isLoading: memberListLoading } =
    useGetMembers(workspaceId);

  const isLoading = useMemo(() => {
    return currentMemberLoading || memberListLoading;
  }, [currentMemberLoading, memberListLoading]);

  return (
    <>
      <Card className="mt-4">
        <CardHeader className="flex items-center flex-row gap-x-4">
          <CardTitle className="text-lg text-center">Member List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {isLoading
              ? [1, 2, 3].map((i) => <MemberListItemSkeleton key={i} />)
              : membersList?.data?.map((member) => (
                  <MemberListItem
                    key={member.$id}
                    member={member}
                    currentMember={currentMember?.data}
                    workspaceId={workspaceId}
                  />
                ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
