import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import type { User } from "../../types";
import { Input } from "./Input";
import UserAvatar from "./UserAvatar";

interface CreateGroupProps {
  open: boolean;
  mode: "create" | "add";
  users: User[];
  excludedUserIds?: string[];
  onCancel: () => void;
  onSubmit: (groupName: string, memberIds: string[]) => Promise<void>;
}

const CreateGroup = ({ open, mode, users = [], excludedUserIds = [], onCancel, onSubmit }: CreateGroupProps) => {
  const [groupName, setGroupName] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectableUsers = useMemo(() => {
    const excludedSet = new Set(excludedUserIds.map(id => String(id)));
    return users.filter((user) => !excludedSet.has(user.uid));
  }, [users, excludedUserIds]);

  if (!open) return null;

  const canSubmit = selectedMemberIds.length >= (mode === "create" ? 2 : 1) && !isSubmitting && (mode === "add" || groupName.trim().length > 0);

  const close = () => {
    if (isSubmitting) return;
    setGroupName("");
    setSelectedMemberIds([]);
    setError("");
    onCancel();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit(groupName, selectedMemberIds);
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <form onSubmit={handleSubmit} className="flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-950 to-blue-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <div>
            <h3 className="text-lg font-bold text-white">{mode === "create" ? "New Community" : "Add Members"}</h3>
            <p className="text-[11px] font-medium text-slate-400">{selectedMemberIds.length} selected</p>
          </div>
          <button type="button" onClick={close} className="size-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-5 custom-scrollbar">
          {mode === "create" && (
            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">Group Identity</label>
               <Input placeholder="What's the group name?" value={groupName} onChange={(e) => setGroupName(e.target.value)} 
                inputClassName="bg-white/5 border-white/10 focus:border-cyan-600 text-white" />
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">Select Contacts</label>
            <div className="space-y-2">
              {selectableUsers.length > 0 ? (
                selectableUsers.map((user) => {
                  const uid = user.uid;
                  const isSelected = selectedMemberIds.includes(uid);
                  return (
                    <button key={uid} type="button" onClick={() => setSelectedMemberIds(prev => isSelected ? prev.filter(id => id !== uid) : [...prev, uid])} 
                      className={`flex w-full items-center rounded-2xl border p-3 transition-all ${isSelected ? "border-cyan-500/40 bg-cyan-500/5" : "border-white/5 bg-white/5 hover:bg-white/10"}`}>
                      <UserAvatar user={user} size="md" className="mr-3 shadow-md" />
                      <div className="flex-1 truncate">
                        <p className="text-sm font-bold text-cyan-50 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <div className={`ml-3 flex size-5 items-center justify-center rounded-full border transition-all ${isSelected ? "bg-cyan-50 border-cyan-50 text-cyan-950" : "border-white/20 text-transparent"}`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-10 text-center bg-white/5 rounded-2xl border border-white/5 border-dashed">
                  <p className="text-sm font-bold text-slate-400">No users available</p>
                </div>
              )}
            </div>
          </div>
          {error && <p className="text-xs font-semibold text-rose-400 text-center">{error}</p>}
        </div>

        <div className="flex gap-3 border-t border-white/5 px-6 py-5 bg-black/20">
          <button type="button" onClick={close} className="flex-1 rounded-xl border border-white/10 py-3 text-xs font-bold text-slate-300 hover:bg-white/5">Cancel</button>
          <button type="submit" disabled={!canSubmit} className="flex-1 rounded-xl bg-cyan-50 py-3 text-xs font-bold text-cyan-950 hover:bg-cyan-100 disabled:opacity-30 shadow-lg shadow-cyan-500/20 transition-all">
            {isSubmitting ? <Loader2 className="mx-auto animate-spin size-4" /> : (mode === "create" ? "Create Group" : "Update Members")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;