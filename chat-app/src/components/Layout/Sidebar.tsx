import type { ChangeEvent, FC } from "react";
import { useState } from "react";
import { Camera, Loader2, LogOut, MessageSquare, Plus, Search, UserCircle2, Users } from "lucide-react";
import UserCard from "../UI/UserCard";
import UserAvatar from "../UI/UserAvatar";
import CreateGroup from "../UI/CreateGroup";
import { formatChatTime } from "../../utils/dateUtils";
import { Input } from "../UI/Input";
import type { Chat } from "../../types/chat";
import type {User} from "../../types/user";

interface SidebarProps {
  me: User | undefined;
  otherUsers: User[];
  selectedUser: User | null;
  selectedGroupChatId?: string | null;
  groupChats?: Chat[];
  chatPreviewsByUserId?: Record<string, {
    unreadCount: number;
    lastMessageTime: string;
  }>;
  isChatOpen?: boolean;
  searchQuery: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onUserClick: (user: User) => void;
  onGroupClick: (chat: Chat) => void;
  onCreateGroup: (groupName: string, memberIds: string[]) => Promise<void>;
  onLogoutClick: () => void;
  onProfileImageChange: (file: File) => void;
  onProfileEdit: () => void;
  isProfileImageUploading?: boolean;
}

const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button onClick={onClick} 
    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${active ? "bg-cyan-50 text-cyan-900 shadow-lg" : "text-slate-400 hover:text-slate-200"}`}>
    <Icon size={14} /> {label}
  </button>
);

const Sidebar: FC<SidebarProps> = ({
  me,
  otherUsers,
  selectedUser,
  selectedGroupChatId = null,
  groupChats = [],
  chatPreviewsByUserId = {},
  isChatOpen = false,
  searchQuery,
  onSearchChange,
  onUserClick,
  onGroupClick,
  onCreateGroup,
  onLogoutClick,
  onProfileImageChange,
  onProfileEdit,
  isProfileImageUploading = false,
}) => {
  const [activeTab, setActiveTab] = useState<"chats" | "groups">("chats");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const handleProfileImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) {
      onProfileImageChange(file);
    }
  };

  return (
    <aside className={`${isChatOpen ? "hidden md:flex" : "flex"} h-full w-full flex-col border-r border-white/10 bg-gradient-to-br from-cyan-950 to-blue-950 md:w-[20rem] lg:w-[23rem]`}>
      {me && (
        <div className="mx-4 mt-4 overflow-hidden rounded-2xl border border-white/10 bg-cyan-50 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <label className="relative shrink-0 cursor-pointer group">
                <UserAvatar user={me} size="md" className="border-2 border-cyan-500/50" />
                <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border border-white/20 bg-cyan-600 text-white shadow-md transition-transform group-hover:scale-110">
                  {isProfileImageUploading ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Camera className="size-3" />
                  )}
                </span>
                <input type="file" accept="image/*" className="sr-only" onChange={handleProfileImageInput} />
              </label>
              <button type="button" onClick={onProfileEdit} className="min-w-0 text-left">
                <p className="truncate text-md font-bold text-cyan-900 leading-tight">{me.name}</p>
                <p className="text-xs text-gray-400">{me.email}</p>
              </button>
            </div>

            <button
              type="button"
              onClick={onLogoutClick}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50/5 text-cyan-900 transition-all hover:bg-rose-400/20 hover:text-rose-500 border border-white/5"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="px-5 py-6 space-y-4">
        <Input
          placeholder="Search conversations..." 
          value={searchQuery}
          onChange={onSearchChange}
          icon={<Search size={16} />}
          className="text-sm"
          inputClassName="bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-white/10 focus:border-cyan-500/40"
        />

        <div className="grid grid-cols-2 rounded-xl bg-black/20 p-1 border border-white/5">
          <TabButton active={activeTab === "chats"} onClick={() => setActiveTab("chats")} icon={MessageSquare} label="Chats" />
          <TabButton active={activeTab === "groups"} onClick={() => setActiveTab("groups")} icon={Users} label="Groups" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        <div className="flex items-center justify-between px-3 pb-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-cyan-50/70">
            {activeTab === "chats" ? "Recent Activity" : "Your Communities"}
          </p>
          {activeTab === "groups" && (
            <button 
              onClick={() => setIsGroupModalOpen(true)} 
              className="flex items-center gap-1 text-[12px] font-bold text-cyan-500 hover:text-cyan-300 transition-colors"
            >
              <Plus size={14} />Create Group
            </button>
          )}
        </div>

        <div className="space-y-2 pb-4">
          {activeTab === "chats" ? (
            otherUsers.length > 0 ? (
              otherUsers.map((user) => (
                <UserCard 
                  key={user.uid} 
                  user={user} 
                  selected={selectedUser?.uid === user.uid} 
                  unreadCount={chatPreviewsByUserId[user.uid]?.unreadCount ?? 0} 
                  lastMessageTime={chatPreviewsByUserId[user.uid]?.lastMessageTime} 
                  onClick={() => onUserClick(user)} 
                />
              ))
            ) : (
              <EmptyState title="No users found" />
            )
          ) : (
            groupChats.length > 0 ? (
              groupChats.map((chat) => (
                <UserCard 
                  key={chat.chatId} 
                  title={chat.groupName || "Group chat"} 
                  subtitle={chat.lastMessage || `${chat.members.length} members`} 
                  avatar={
                    <div className="flex size-11 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 font-black">
                      <Users size={20} />
                    </div>
                  } 
                  onClick={() => onGroupClick(chat)} 
                  selected={selectedGroupChatId === chat.chatId} 
                  unreadCount={chat.unreadCount?.[me?.uid ?? ""] ?? 0} 
                  lastMessageTime={formatChatTime(chat.updatedAt)} 
                />
              ))
            ) : (
              <EmptyState title="No groups found" />
            )
          )}
        </div>
      </div>

      <CreateGroup 
        open={isGroupModalOpen}
        mode="create"
        users={otherUsers}
        onCancel={() => setIsGroupModalOpen(false)}
        onSubmit={onCreateGroup}
      />
    </aside>
  );
};

const EmptyState = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center px-6 pt-12 text-center">
    <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-500">
      <UserCircle2 size={28} strokeWidth={1.5} />
    </div>
    <p className="text-sm font-bold text-slate-300">{title}</p>
    <p className="mt-1 text-xs text-slate-500">Nothing to show here yet.</p>
  </div>
);

export default Sidebar;
