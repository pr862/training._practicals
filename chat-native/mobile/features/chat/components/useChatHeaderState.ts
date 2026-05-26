import { useState } from "react";
import type { Chat } from "../../../../packages/data/chat/model";
import type { User } from "../../../../packages/data/user/model";

type ConfirmAction = "leave" | "delete" | null;

interface UseChatHeaderStateProps {
  user?: User;
  group?: Chat;
  groupMembers: User[];
  currentUserId?: string;
  onViewGroupInfo?: () => void;
  onLeaveGroup?: () => void;
  onDeleteGroup?: () => void;
  onAddMembers?: () => void;
}

export function useChatHeaderState({
  user,
  group,
  groupMembers,
  currentUserId,
  onViewGroupInfo,
  onLeaveGroup,
  onDeleteGroup,
  onAddMembers,
}: UseChatHeaderStateProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const isGroup = Boolean(group);
  const isGroupAdmin = group?.adminId === currentUserId;
  const hasMenuActions = Boolean(
    onViewGroupInfo || onLeaveGroup || (isGroupAdmin && onAddMembers) || (isGroupAdmin && onDeleteGroup)
  );
  const canShowDelete = Boolean(
    onDeleteGroup &&
      isGroupAdmin &&
      !group?.deletedAt &&
      group?.adminExitedAt
  );

  const title = group?.groupName || user?.name || user?.email?.split("@")[0] || "Conversation";
  const subtitle = group
    ? groupMembers.map((member) => member.name || member.email).filter(Boolean).join(", ") || `${group.members.length} members`
    : user?.email;

  const runMenuAction = (action: () => void) => {
    setShowMenu(false);
    requestAnimationFrame(action);
  };

  const requestLeaveConfirm = () => {
    setShowMenu(false);
    setConfirmAction("leave");
  };

  const requestDeleteConfirm = () => {
    setShowMenu(false);
    setConfirmAction("delete");
  };

  return {
    showMenu,
    setShowMenu,
    confirmAction,
    setConfirmAction,
    isGroup,
    isGroupAdmin,
    hasMenuActions,
    canShowDelete,
    title,
    subtitle,
    runMenuAction,
    requestLeaveConfirm,
    requestDeleteConfirm,
  };
}
