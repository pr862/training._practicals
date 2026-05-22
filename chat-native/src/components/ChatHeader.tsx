import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View, Platform } from 'react-native';
import { ArrowLeft, Trash2, MoreVertical, Users, LogOut, UserPlus, Info } from 'lucide-react-native';

import ConfirmationModal from './ConfirmationModal';
import UserAvatar from './UserAvatar';
import type { Chat } from '../types/chat';
import type { User } from '../types/user';
import { colors, textStyles } from '../constants/theme';

interface ChatHeaderProps {
  user?: User;
  group?: Chat;
  groupMembers?: User[];
  currentUserId?: string;
  onBack?: () => void;
  onLeaveGroup?: () => void;
  onDeleteGroup?: () => void;
  onAddMembers?: () => void;
  onViewGroupInfo?: () => void;
}

const ChatHeader = ({
  user,
  group,
  groupMembers = [],
  currentUserId,
  onBack,
  onLeaveGroup,
  onDeleteGroup,
  onAddMembers,
  onViewGroupInfo,
}: ChatHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'leave' | 'delete' | null>(null);

  const isGroup = Boolean(group);
  const isGroupAdmin = group?.adminId === currentUserId;
  const hasMenuActions = Boolean(
    onViewGroupInfo || onLeaveGroup || (isGroupAdmin && onAddMembers) || (isGroupAdmin && onDeleteGroup)
  );

  const title = group?.groupName || user?.name || user?.email?.split('@')[0] || 'Conversation';
  const subtitle = group
    ? groupMembers.map((m) => m.name || m.email).filter(Boolean).join(', ') || `${group.members.length} members`
    : user?.email;

  const runMenuAction = (action: () => void) => {
    setShowMenu(false);
    requestAnimationFrame(action);
  };

  const requestLeaveConfirm = () => {
    setShowMenu(false);
    setConfirmAction('leave');
  };

  const requestDeleteConfirm = () => {
    setShowMenu(false);
    setConfirmAction('delete');
  };

  const MenuItem = ({ icon: Icon, label, onPress, color = '#334155', }: {
    icon: any;
    label: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon size={18} color={color} />
      <Text style={[styles.menuItemText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );

  const canShowDelete = Boolean(
    onDeleteGroup &&
      isGroupAdmin &&
      !group?.deletedAt &&
      group?.adminExitedAt
  );


  return (
    <View style={styles.header}>

      <View style={styles.leftContainer}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <ArrowLeft size={22} color="#ecfeff" />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          {isGroup ? (
            <View style={styles.groupAvatar}>
              <Users size={22} color={colors.accentText} />
            </View>
          ) : user ? (
            <UserAvatar user={user} size="md" />
          ) : null}
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
          </View>
        </View>
      </View>

      {isGroup && hasMenuActions && (
        <View>
          <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.iconButton}>
            <MoreVertical size={20} color={colors.text} />
          </TouchableOpacity>

          <Modal visible={showMenu} transparent={true} animationType="fade" onRequestClose={() => setShowMenu(false)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
              <TouchableOpacity activeOpacity={1} style={styles.menuContainer}>
                {onViewGroupInfo && (
                  <MenuItem icon={Info} label="Group Info" onPress={() => runMenuAction(onViewGroupInfo)} color={colors.text} />
                )}
                {onLeaveGroup && (
                  <MenuItem
                    icon={LogOut}
                    label="Leave Group"
                    onPress={requestLeaveConfirm}
                    color={colors.text}
                  />
                )}

                {canShowDelete && (
                  <MenuItem
                    icon={Trash2}
                    label="Delete Group"
                    onPress={requestDeleteConfirm}
                    color={colors.danger}
                  />
                )}

                {isGroupAdmin && onAddMembers && (
                  <MenuItem
                    icon={UserPlus}
                    label="Add Members"
                    onPress={() => runMenuAction(onAddMembers)}
                    color={colors.danger}
                  />
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>
      )}

      <ConfirmationModal
        open={confirmAction === 'leave'}
        title="Leave group"
        description="Are you sure you want to leave this group?"
        confirmLabel="Leave"
        variant="danger"
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => (onLeaveGroup ? onLeaveGroup() : undefined)}
      />

      <ConfirmationModal
        open={confirmAction === 'delete'}
        title="Delete group"
        description="This will permanently delete the group. Are you sure?"
        confirmLabel="Delete"
        variant="danger"
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => (onDeleteGroup ? onDeleteGroup() : undefined)}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: colors.surfaceRaised,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 19,
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...textStyles.title,
    color: colors.text,
  },
  subtitle: {
    ...textStyles.subtitle,
    color: colors.textMuted,
    marginTop: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  menuContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 50,
    right: 16,
    width: 190,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  menuItemText: {
    ...textStyles.formLabel,
    color: colors.text,
  },
});

export default ChatHeader;
