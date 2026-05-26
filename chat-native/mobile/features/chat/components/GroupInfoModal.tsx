import { Shield, Trash2, UserMinus, X } from "lucide-react-native";
import type { User } from "../../../../packages/data/user/model";
import type { Chat } from "../../../../packages/data/chat/model";
import ConfirmationModal from "../../../../packages/style/components/ConfirmationModal";
import UserAvatar from "../../../../packages/style/components/UserAvatar";
import Loading from "../../../../packages/style/components/Loading";
import { Modal, ScrollView, Text, TouchableOpacity, StyleSheet, View, Dimensions } from "react-native";
import { colors, textStyles } from "../../../../packages/style/theme";
import { useGroupInfoModalState } from "./useGroupInfoModalState";

interface GroupInfoModalProps {
  open: boolean;
  group: Chat;
  members: User[];
  currentUserId?: string;
  onCancel: () => void;
  onRemoveMember: (memberId: string) => Promise<void>;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const GroupInfoModal = ({ open, group, members, currentUserId, onCancel, onRemoveMember }: GroupInfoModalProps) => {
  const {
    removingMemberId,
    memberToRemove,
    setMemberToRemove,
    isAdmin,
    removeMember,
  } = useGroupInfoModalState({ group, currentUserId, onRemoveMember });

  if (!open) return null;

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title} numberOfLines={1}>{group.groupName || "Group chat"}</Text>
              <Text style={styles.subtitle}>{members.length} member{members.length === 1 ? "" : "s"}</Text>
            </View>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            <View style={styles.memberList}>
              {members.map((member) => {
                const memberIsAdmin = member.uid === group.adminId;
                const canRemove = isAdmin && !memberIsAdmin && !group.deletedAt;
                return (
                  <View key={member.uid} style={styles.memberCard}>
                    <UserAvatar user={member} size="md" />
                    <View style={styles.memberDetails}>
                      <View style={styles.nameRow}>
                        <Text style={styles.memberName}>{member.name || member.email}</Text>
                        {memberIsAdmin && (
                          <View style={styles.adminBadge}>
                            <Shield size={10} color={colors.accentText} />
                            <Text style={styles.adminBadgeText}>Admin</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.memberEmail} numberOfLines={1}>{member.email}</Text>
                    </View>
                    {canRemove && (
                      <TouchableOpacity
                        onPress={() => setMemberToRemove(member)}
                        disabled={Boolean(removingMemberId)}
                        style={[styles.removeButton, Boolean(removingMemberId) && styles.disabledButton]}
                      >
                        {removingMemberId === member.uid ? (
                          <Loading size="small" iconColor={colors.danger} style={styles.removeButtonLoading} />
                        ) : (
                          <UserMinus size={17} color={colors.danger} />
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
            {isAdmin && members.length === 1 && !group.deletedAt && !group.adminExitedAt && (
              <View style={styles.warningCard}>
                <Trash2 size={16} color={colors.danger} style={styles.warningIcon} />
                <Text style={styles.warningText}>You’re the only member left. To close this group permanently, you'll need to exit and then delete it.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
      <ConfirmationModal
        open={Boolean(memberToRemove)}
        title="Remove member"
        description={`Remove ${memberToRemove?.name || memberToRemove?.email || "this member"} from ${group.groupName || "this group"}?`}
        confirmLabel="Remove"
        variant="danger"
        onCancel={() => setMemberToRemove(null)}
        onConfirm={() => (memberToRemove ? removeMember(memberToRemove.uid) : undefined)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    maxHeight: SCREEN_HEIGHT * 0.75,
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    ...textStyles.button,
    color: colors.text,
  },
  subtitle: {
    ...textStyles.subtitle,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  scrollContainer: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  memberList: {
    gap: 2,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  memberDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memberName: {
    ...textStyles.formLabel,
    color: colors.text,
    flexShrink: 1,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.accentText,
    textTransform: "uppercase",
  },
  memberEmail: {
    ...textStyles.subtitle,
    color: colors.textSoft,
    marginTop: 1,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonLoading: {
    height: "100%",
    width: "100%",
  },
  disabledButton: {
    opacity: 0.5,
  },
  warningCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
  },
  warningIcon: {
    marginTop: 2,
    marginRight: 12,
    flexShrink: 0,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.danger,
  },
});

export default GroupInfoModal;
