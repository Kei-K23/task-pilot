"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMembers } from "../api/use-get-members";
import { useGetWorkspaceParam } from "@/features/workspaces/hooks/use-get-workspace-param";
import { useGetCurrentMember } from "../api/use-get-current-member";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import MemberListItem from "./member-list-item";

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
            {isLoading ? (
              <div className="w-full h-[60px] border-b pb-4 last:border-b-0 last:pb-0 flex gap-x-2 justify-between">
                <div className="flex gap-x-2">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-[100px] h-4" />
                    <Skeleton className="w-[140px] h-4" />
                  </div>
                </div>
                <Skeleton className="size-10" />
              </div>
            ) : (
              membersList?.data?.map((member) => (
                <MemberListItem
                  key={member.$id}
                  member={member}
                  currentMember={currentMember?.data}
                  workspaceId={workspaceId}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
