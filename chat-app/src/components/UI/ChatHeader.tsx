import { useState, useRef } from 'react';
import { ArrowLeft, Trash2, MoreVertical, Users, LogOut, UserPlus } from 'lucide-react';
import UserAvatar from '../UI/UserAvatar';
import type { Chat, User } from '../../types';

interface ChatHeaderProps {
  user?: User;
  group?: Chat;
  groupMembers?: User[];
  currentUserId?: string;
  onBack?: () => void;
  onLeaveGroup?: () => void;
  onDeleteGroup?: () => void;
  onAddMembers?: () => void;
}
const ChatHeader = ({ user, group, groupMembers = [], currentUserId, onBack, onLeaveGroup, onDeleteGroup, onAddMembers }: ChatHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isGroup = Boolean(group);
  const isGroupAdmin = group?.adminId === currentUserId;

  const title = group?.groupName || user?.name || user?.email?.split('@')[0] || 'Conversation';
  const subtitle = group 
    ? groupMembers.map((m) => m.name || m.email).filter(Boolean).join(', ') || `${group.members.length} members` 
    : user?.email;

  return (
    <div className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-blue-900/10 bg-gradient-to-br from-cyan-950 to-blue-950 px-3 shadow-sm backdrop-blur-xl sm:h-20 sm:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-cyan-50 transition-all hover:bg-white/10 md:hidden"
          >
            <ArrowLeft size={21} strokeWidth={2.4} />
          </button>
        )}

        <div className="flex min-w-0 items-center gap-3">
          {isGroup ? (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 shadow-inner">
              <Users size={21} />
            </div>
          ) : user ? (
            <UserAvatar user={user} size="md" className="size-11" />
          ) : null}

          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-bold tracking-tight text-blue-50 sm:text-base">
              {title}
            </h3>
            {subtitle && <p className="truncate text-xs font-medium text-slate-400">{subtitle}</p>}
          </div>
        </div>
      </div>

      {isGroup && (
        <div className="relative z-30" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex size-10 items-center justify-center rounded-full text-cyan-50 transition-all hover:bg-white/10 active:scale-95"
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-blue-100 bg-white p-1.5 shadow-xl shadow-blue-900/10 z-50">
              {onLeaveGroup && (
                <button
                  onClick={() => { onLeaveGroup(); setShowMenu(false); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50"
                >
                  <LogOut size={16} />
                  Leave Group
                </button>
              )}
              {isGroupAdmin && onAddMembers && (
                <button
                  onClick={() => { onAddMembers(); setShowMenu(false); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50"
                >
                  <UserPlus size={16} />
                  Add Members
                </button>
              )}
              {isGroupAdmin && onDeleteGroup && (
                <button
                  onClick={() => { onDeleteGroup(); setShowMenu(false); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <Trash2 size={16} />
                  Delete Group
                </button>
              )}
            </div>
          )}
        </div>
      )}
      </div>
  );
};

export default ChatHeader;
