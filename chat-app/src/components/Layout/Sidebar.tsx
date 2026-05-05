import type { ChangeEvent, FC } from "react";
import { Camera, Loader2, LogOut, Search, UserCircle2 } from "lucide-react";
import { Input } from "../UI/Input";
import UserCard from "../UI/UserCard";
import UserAvatar from "../UI/UserAvatar";
import type { User } from "../../types";

interface SidebarProps {
  me: User | undefined;
  otherUsers: User[];
  selectedUser: User | null;
  chatPreviewsByUserId?: Record<string, {
    unreadCount: number;
    lastMessageTime: string;
  }>;
  isChatOpen?: boolean;
  searchQuery: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onUserClick: (user: User) => void;
  onLogoutClick: () => void;
  onProfileImageChange: (file: File) => void;
  isProfileImageUploading?: boolean;
}

const Sidebar: FC<SidebarProps> = ({
  me,
  otherUsers,
  selectedUser,
  chatPreviewsByUserId = {},
  isChatOpen = false,
  searchQuery,
  onSearchChange,
  onUserClick,
  onLogoutClick,
  onProfileImageChange,
  isProfileImageUploading = false,
}) => {
  const handleProfileImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) {
      onProfileImageChange(file);
    }
  };

  return (
    <aside className={`${isChatOpen ? "hidden md:flex" : "flex"} h-full w-full flex-col border-r border-slate-200 bg-white md:w-[20rem] lg:w-[23rem]`}>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600">Secure Chat</p>
          <h2 className="mt-0.5 truncate text-2xl font-black tracking-tight text-slate-900">Messages</h2>
        </div>
      </div>

      {me && (
        <div className="mx-4 mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-500 ">
          <div className="flex items-center justify-between bg-white/5 px-4 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-4 min-w-0">
              <label className="relative shrink-0 cursor-pointer group" aria-label="Update profile image">
                <UserAvatar user={me} size="md" className="border-2 border-blue-500" />
                <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-blue-500 bg-white text-blue-500 shadow-md transition-transform group-hover:scale-110">
                  {isProfileImageUploading ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Camera className="size-3" />
                  )}
                </span>
                <input type="file" accept="image/*" className="sr-only" disabled={isProfileImageUploading} onChange={handleProfileImageInput} />
              </label>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{me.name || "My profile"}</p>
                <p className="truncate text-[11px] text-slate-200 opacity-80">{me.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogoutClick}
              className="ml-2 flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-all hover:bg-rose-500 hover:text-white focus:outline-none"
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="px-5 py-6">
        <div className="relative">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={onSearchChange}
            inputClassName="rounded-xl border-slate-100 bg-slate-50 py-5 pl-10 text-sm shadow-none focus:bg-white focus:ring-2 focus:ring-blue-500/10"
            icon={<Search size={16} className="text-slate-400" />}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        {otherUsers.length > 0 && (
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Recent Chats
          </p>
        )}
        <div className="space-y-1 pb-4">
          {otherUsers.length > 0 ? (
            otherUsers.map((user) => (
              <div key={user.uid}>
                <UserCard
                  user={user}
                  selected={selectedUser?.uid === user.uid}
                  unreadCount={chatPreviewsByUserId[user.uid]?.unreadCount ?? 0}
                  lastMessageTime={chatPreviewsByUserId[user.uid]?.lastMessageTime}
                  onClick={() => onUserClick(user)}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center px-6 pt-12 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-slate-50">
                <UserCircle2 className="text-slate-300" size={28} />
              </div>
              <p className="text-sm font-semibold text-slate-600">No users found</p>
              <p className="mt-1 text-xs text-slate-400">Try searching for someone else.</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
