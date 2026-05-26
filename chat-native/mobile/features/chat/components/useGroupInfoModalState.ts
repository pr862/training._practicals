import { useState } from "react";
import type { Chat } from "../../../../packages/data/chat/model";
import type { User } from "../../../../packages/data/user/model";

interface UseGroupInfoModalStateProps {
  group: Chat;
  currentUserId?: string;
  onRemoveMember: (memberId: string) => Promise<void>;
}

export function useGroupInfoModalState({
  group,
  currentUserId,
  onRemoveMember,
}: UseGroupInfoModalStateProps) {
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);
  const isAdmin = group.adminId === currentUserId;

  const removeMember = async (memberId: string) => {
    if (removingMemberId) return;
    setRemovingMemberId(memberId);
    try {
      await onRemoveMember(memberId);
      setMemberToRemove(null);
    } finally {
      setRemovingMemberId(null);
    }
  };

  return {
    removingMemberId,
    memberToRemove,
    setMemberToRemove,
    isAdmin,
    removeMember,
  };
}
