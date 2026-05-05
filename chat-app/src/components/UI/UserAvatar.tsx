import type { User } from '../../types';
import { useImageFallback } from '../../hooks/useImageFallback';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'size-8 text-[10px]',
  md: 'size-11 text-xs',
  lg: 'size-14 text-base',
  xl: 'size-20 text-xl',
};

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const UserAvatar = ({ user, size = 'md', className = '' }: UserAvatarProps) => {
  const name = user.name || user.email || '?';
  const image = user.photoURL;
  const { hasError, handleError } = useImageFallback(image);
  const initials = getInitials(name);

  return (
    <div
      className={`
        relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl 
        bg-gradient-to-br from-slate-100 to-slate-200 font-black tracking-tighter text-slate-500
        shadow-inner transition-transform duration-200 active:scale-95
        ${sizeClasses[size]} 
        ${className}
      `}
    >
      {image && !hasError ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-opacity duration-300"
          onError={handleError}
        />
      ) : (
        <span className="drop-shadow-sm">{initials}</span>
      )}

      <div className="pointer-events-none absolute inset-0 rounded-2xl border-[1.5px] border-black/5" />
    </div>
  );
};

export default UserAvatar;
