import { View, Text, Image, StyleSheet } from 'react-native';
import type { User } from '../../../packages/data/user/model';
import { useUserAvatarState } from './useUserAvatarState';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const getInitials = (name: string) => name
  .split(/\s+/)
  .filter(Boolean)
  .map((part) => part[0])
  .join('')
  .toUpperCase()
  .slice(0, 2);

const UserAvatar = ({ user, size = 'md' }: UserAvatarProps) => {
  const name = user.name || user.email || '?';
  const image = user.photoURL;
  const initials = getInitials(name);
  const { hasError, handleImageError } = useUserAvatarState(image);

  const currentDimensions = sizeStyles[size];

  return (
    <View style={[styles.avatarContainer, currentDimensions]}>
      {image && !hasError ? (
        <Image
          source={{ uri: image }}
          alt={name}
          style={styles.avatarImage}
          onError={handleImageError}
        />
      ) : (
        <Text style={[styles.initialsText, sizeTextStyles[size]]}>{initials}</Text>
      )}

      <View style={styles.borderOverlay} pointerEvents="none" />
    </View>
  );
};

const sizeStyles = StyleSheet.create({
  sm: { width: 32, height: 32, borderRadius: 16 },
  md: { width: 44, height: 44, borderRadius: 22 },
  lg: { width: 56, height: 56, borderRadius: 28 },
  xl: { width: 80, height: 80, borderRadius: 40 },
});

const sizeTextStyles = StyleSheet.create({
  sm: { fontSize: 10 },
  md: { fontSize: 12 },
  lg: { fontSize: 16 },
  xl: { fontSize: 20 },
});

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  initialsText: {
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: -0.5,
  },
  borderOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
});

export default UserAvatar;
