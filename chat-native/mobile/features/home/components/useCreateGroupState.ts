import { useMemo, useState } from "react";
import type { User } from "../../../../packages/data/user/model";

interface UseCreateGroupStateProps {
  mode: "create" | "add";
  users: User[];
  excludedUserIds: string[];
  onCancel: () => void;
  onSubmit: (groupName: string, memberIds: string[]) => Promise<string | void>;
}

export function useCreateGroupState({
  mode,
  users,
  excludedUserIds,
  onCancel,
  onSubmit,
}: UseCreateGroupStateProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectableUsers = useMemo(() => {
    const excludedSet = new Set(excludedUserIds.map((id) => String(id)));
    return users.filter((user) => !excludedSet.has(user.uid));
  }, [users, excludedUserIds]);

  const isCreateMode = mode === "create";
  const hasMinMembers = selectedMemberIds.length >= (isCreateMode ? 2 : 1);
  const isNameValid = !isCreateMode || groupName.trim().length > 0;
  const canSubmit = hasMinMembers && !isSubmitting && isNameValid;

  const resetForm = () => {
    setGroupName("");
    setSelectedMemberIds([]);
    setError("");
  };

  const close = () => {
    if (isSubmitting) return;
    resetForm();
    onCancel();
  };

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit(groupName.trim(), selectedMemberIds);
      resetForm();
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    groupName,
    setGroupName,
    selectedMemberIds,
    error,
    isSubmitting,
    selectableUsers,
    isCreateMode,
    canSubmit,
    close,
    toggleMember,
    handleSubmit,
  };
}
