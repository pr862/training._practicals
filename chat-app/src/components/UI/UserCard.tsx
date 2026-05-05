import type { User } from '../../types';
import UserAvatar from './UserAvatar';

interface UserCardProps {
  user: User;
  onClick?: (user: User) => void;
  className?: string;
  selected?: boolean;
  unreadCount?: number;
  lastMessageTime?: string;
}

const UserCard = ({
  user,
  onClick,
  className = '',
  selected = false,
  unreadCount = 0,
  lastMessageTime = ''
}: UserCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(user)}
      className={`group flex w-full items-center rounded-2xl border px-3 py-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 ${selected
          ? 'border-blue-100 bg-blue-50 shadow-sm shadow-blue-100/60'
          : 'border-slate-100 bg-white shadow-sm shadow-slate-200/50 hover:border-slate-200 hover:bg-slate-50'
        } ${className}`}
    >
      <div className="relative mr-3 flex-shrink-0">
        <UserAvatar
          user={user}
          size="md"
          className="size-12"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-baseline justify-between gap-3">
          <h3 className="truncate text-[15px] font-semibold text-slate-900">
            {user.name || 'New User'}
          </h3>
          {lastMessageTime && (
            <span className={`shrink-0 text-[11px] ${unreadCount > 0 ? 'font-semibold text-blue-500' : 'text-slate-400'}`}>
              {lastMessageTime}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="flex-1 truncate text-[13px] leading-tight text-slate-500">
            {user.email}
          </p>

          {unreadCount > 0 && (
            <div className="ml-2 flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-bold text-white">
              {unreadCount}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default UserCard;
