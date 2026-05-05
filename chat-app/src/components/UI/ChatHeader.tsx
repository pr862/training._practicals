import { ArrowLeft } from 'lucide-react';
import UserAvatar from '../UI/UserAvatar';
import type { User } from '../../types';

interface ChatHeaderProps {
  user: User;
  onBack?: () => void;
}

const ChatHeader = ({ user, onBack }: ChatHeaderProps) => {
  return (
    <div className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white/95 px-3 shadow-sm shadow-slate-200/60 backdrop-blur-xl sm:h-20 sm:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-950 active:scale-95 md:hidden"
            aria-label="Back"
          >
            <ArrowLeft size={21} strokeWidth={2.4} />
          </button>
        )}

        <div className="flex min-w-0 items-center gap-3">
          <div className="group relative shrink-0 cursor-pointer">
            <UserAvatar key={user.uid} user={user} size="md" className="size-11" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-bold tracking-tight text-slate-950 sm:text-base">
              {user.name || user.email?.split('@')[0]}
            </h3>
            <p className="truncate text-xs font-medium text-slate-400">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
