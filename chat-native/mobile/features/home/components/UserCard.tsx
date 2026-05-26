import type { ReactNode } from "react";
import type { User } from '../../../../packages/data/user/model';
import UserAvatar from '../../../../packages/style/components/UserAvatar';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { colors, textStyles } from '../../../../packages/style/theme';

interface UserCardProps {
  user?: User;
  title?: string;
  subtitle?: string;
  avatar?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

const UserCard = ({
  user,
  title,
  subtitle,
  avatar,
  onClick,
  selected = false,
  unreadCount = 0,
  lastMessage,
  lastMessageTime = ''
}: UserCardProps) => {
  const displayTitle = title || user?.name || 'New User';

  const displaySubtitle = lastMessage || subtitle || user?.email || '';

  const displayAvatar = avatar || (user ? <UserAvatar user={user} size="md" /> : null);
  const hasUnread = unreadCount > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onClick}
      style={[
        styles.cardContainer,
        selected && styles.cardSelected
      ]}
    >
      <View style={styles.avatarWrapper}>{displayAvatar}</View>

      <View style={styles.textContainer}>
        <View style={styles.rowTop}>
          <Text
            numberOfLines={1}
            style={[
              styles.titleText,
              hasUnread ? styles.titleTextUnread : styles.titleTextRead
            ]}
          >
            {displayTitle}
          </Text>
          {lastMessageTime ? (
            <Text style={[styles.timeText, hasUnread ? styles.timeTextUnread : styles.timeTextRead]}>
              {lastMessageTime}
            </Text>
          ) : null}
        </View>

        <View style={styles.rowBottom}>
          <Text
            numberOfLines={1}
            style={[
              styles.subtitleText,
              hasUnread ? styles.subtitleTextUnread : styles.subtitleTextRead
            ]}
          >
            {displaySubtitle}
          </Text>
          {hasUnread ? (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {unreadCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 2,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  cardSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  avatarWrapper: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    paddingBottom: 12,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
    gap: 12,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  titleText: {
    flex: 1,
    fontSize: 14,
    letterSpacing: -0.15,
  },
  titleTextRead: {
    color: colors.text,
    fontWeight: "400",
  },
  titleTextUnread: {
    color: colors.text,
    fontWeight: "600",
  },
  timeText: {
    fontSize: 10,
  },
  timeTextRead: {
    color: colors.text,
    fontWeight: "400",
  },
  timeTextUnread: {
    color: colors.accent,
    fontWeight: "500",
  },
  subtitleText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  subtitleTextRead: {
    color: colors.textSoft,
  },
  subtitleTextUnread: {
    color: "#cbd5e1",
  },
  badgeContainer: {
    marginLeft: 4,
    height: 18,
    minWidth: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: Platform.OS === 'ios' ? 0 : 14,
  },
});

export default UserCard;
