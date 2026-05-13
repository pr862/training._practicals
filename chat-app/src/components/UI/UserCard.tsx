import type { ReactNode } from "react";
import type { User } from '../../types/user';
import UserAvatar from './UserAvatar';

interface UserCardProps {
  user?: User;
  title?: string;
  subtitle?: string;
  avatar?: ReactNode;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
  unreadCount?: number;
  lastMessageTime?: string;
}

const UserCard = ({
  user,
  title,
  subtitle,
  avatar,
  onClick,
  className = '',
  selected = false,
  unreadCount = 0,
  lastMessageTime = ''
}: UserCardProps) => {
  const displayTitle = title || user?.name || 'New User';
  const displaySubtitle = subtitle || user?.email || '';
  const displayAvatar = avatar || (user ? <UserAvatar user={user} size="md" className="size-12" /> : null);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center rounded-2xl border px-3 py-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 
        ${selected
          ? "border-cyan-100/50 bg-cyan-50 shadow-lg shadow-cyan-900/20 backdrop-blur-md"
          : "border-white/5 bg-white/5 shadow-sm hover:border-white/20 hover:bg-white/10"
        } ${className}`}
    >
      <div className="relative mr-3 flex-shrink-0">{displayAvatar}</div>

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-baseline justify-between gap-2">
          <h3 className={`truncate text-[14px] font-semibold transition-colors 
            ${selected ? "text-cyan-900" : "text-slate-100 group-hover:text-white"}`}>
            {displayTitle}
          </h3>
          {lastMessageTime && (
            <span className={`shrink-0 text-[9px] ${unreadCount > 0 ? "font-semibold text-cyan-600" : "text-slate-400"}`}>
              {lastMessageTime}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className={`flex-1 truncate text-[13px] leading-tight transition-colors
            ${selected ? "text-cyan-850" : "text-slate-400 group-hover:text-slate-300"}`}>
            {displaySubtitle}
          </p>

          {unreadCount > 0 && (
            <div className="ml-2 flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 px-1.5 text-[11px] font-bold text-cyan-950 shadow-sm shadow-cyan-500/20">
              {unreadCount}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default UserCard;
