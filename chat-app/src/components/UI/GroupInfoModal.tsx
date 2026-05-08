import { Loader2, Shield, Trash2, UserMinus, X } from "lucide-react";
import { useState } from "react";
import type { Chat, User } from "../../types";
import ConfirmationModal from "./ConfirmationModal";
import UserAvatar from "./UserAvatar";

interface GroupInfoModalProps {
  open: boolean;
  group: Chat;
  members: User[];
  currentUserId?: string;
  onCancel: () => void;
  onRemoveMember: (memberId: string) => Promise<void>;
}

const GroupInfoModal = ({ open, group, members, currentUserId, onCancel, onRemoveMember }: GroupInfoModalProps) => {
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);
  const isAdmin = group.adminId === currentUserId;

  if (!open) return null;

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-950">{group.groupName || "Group chat"}</h3>
            <p className="text-xs font-semibold text-slate-500">{members.length} member{members.length === 1 ? "" : "s"}</p>
          </div>
          <button type="button" onClick={onCancel} className="flex size-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <div className="space-y-2">
            {members.map((member) => {
              const memberIsAdmin = member.uid === group.adminId;
              const canRemove = isAdmin && !memberIsAdmin && !group.deletedAt;
              return (
                <div key={member.uid} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                  <UserAvatar user={member} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-slate-900">{member.name || member.email}</p>
                      {memberIsAdmin && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-800">
                          <Shield size={11} />
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs font-medium text-slate-500">{member.email}</p>
                  </div>
                  {canRemove && (
                    <button
                      type="button"
                      onClick={() => setMemberToRemove(member)}
                      disabled={Boolean(removingMemberId)}
                      className="flex size-9 items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      title="Remove member"
                    >
                      {removingMemberId === member.uid ? <Loader2 className="size-4 animate-spin" /> : <UserMinus size={17} />}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {isAdmin && members.length === 1 && !group.deletedAt && !group.adminExitedAt && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              <Trash2 className="mt-0.5 size-4 shrink-0" />
              <p className="leading-relaxed">You’re the only member left. To close this group permanently, you'll need to exit and then delete it.</p>
            </div>
          )}
        </div>

        <ConfirmationModal
          open={Boolean(memberToRemove)}
          title="Remove member"
          description={`Remove ${memberToRemove?.name || memberToRemove?.email || "this member"} from ${group.groupName || "this group"}?`}
          confirmLabel="Remove"
          variant="danger"
          onCancel={() => setMemberToRemove(null)}
          onConfirm={() => memberToRemove ? removeMember(memberToRemove.uid) : undefined}
        />
      </div>
    </div>
  );
};

export default GroupInfoModal;
