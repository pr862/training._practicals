import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useMemo, useState } from "react";
import { Check, X } from "lucide-react-native";
import type { User } from "../types/user";
import { Input } from "./Input";
import UserAvatar from "./UserAvatar";
import { colors } from "../constants/theme";
import Button from "./Button";

interface CreateGroupProps {
  open: boolean;
  mode: "create" | "add";
  users: User[];
  excludedUserIds?: string[];
  onCancel: () => void;
  onSubmit: (groupName: string, memberIds: string[]) => Promise<string | void>;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const CreateGroup = ({ open, mode, users = [], excludedUserIds = [], onCancel, onSubmit }: CreateGroupProps) => {
  const [groupName, setGroupName] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectableUsers = useMemo(() => {
    const excludedSet = new Set(excludedUserIds.map(id => String(id)));
    return users.filter((user) => !excludedSet.has(user.uid));
  }, [users, excludedUserIds]);

  if (!open) return null;

  const isCreateMode = mode === "create";
  const hasMinMembers = selectedMemberIds.length >= (isCreateMode ? 2 : 1);
  const isNameValid = !isCreateMode || groupName.trim().length > 0;
  const canSubmit = hasMinMembers && !isSubmitting && isNameValid;

  const resetForm = () => {
    setGroupName("");
    setSelectedMemberIds([]);
    setError("");
  };

  const close = () => {
    if (isSubmitting) return;
    resetForm();
    onCancel();
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit(groupName.trim(), selectedMemberIds);
      resetForm();
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.card}>

          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>{isCreateMode ? "New Community" : "Add Members"}</Text>
              <Text style={styles.headerSubtitle}>{selectedMemberIds.length} selected</Text>
            </View>
            <TouchableOpacity disabled={isSubmitting} onPress={close} style={styles.closeButton}>
              <X size={20} color={colors.textSoft} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            {isCreateMode && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Group Identity</Text>
                <Input
                  placeholder="What's the Group name?"
                  placeholderTextColor={colors.icon}
                  value={groupName}
                  onChangeText={setGroupName}
                />
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.label}>Select Contacts</Text>
              {selectableUsers.length > 0 ? (
                selectableUsers.map((user) => {
                  const uid = user.uid;
                  const isSelected = selectedMemberIds.includes(uid);
                  return (
                    <TouchableOpacity
                      key={uid}
                      onPress={() => setSelectedMemberIds((prev) => isSelected ? prev.filter((id) => id !== uid) : [...prev, uid])}
                      style={[styles.userRow, isSelected ? styles.userRowSelected : styles.userRowUnselected]}
                    >
                      <UserAvatar user={user} size="md" />
                      <View style={styles.userInfo}>
                        <Text numberOfLines={1} style={styles.userName}>{user.name}</Text>
                        <Text numberOfLines={1} style={styles.userEmail}>{user.email}</Text>
                      </View>
                      <View style={[styles.checkbox, isSelected ? styles.checkboxSelected : styles.checkboxUnselected]}>
                        <Check size={12} strokeWidth={3} color={isSelected ? colors.accentText : "transparent"} />
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No users available</Text>
                </View>
              )}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.footer}>
            <Button disabled={isSubmitting} onPress={close} variant="secondary" style={styles.footerButton} textStyle={styles.cancelButtonText}>
              Cancel
            </Button>

            <Button disabled={!canSubmit} loading={isSubmitting} onPress={handleSubmit} style={styles.footerButton} textStyle={styles.submitButtonText}>
              {isCreateMode ? "Create Group" : "Update Members"}
            </Button>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  card: {
    width: "100%",
    maxWidth: 448,
    height: SCREEN_HEIGHT * 0.75,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textSoft,
    marginTop: 2,
  },
  closeButton: {
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexGrow: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: colors.textSoft,
    marginBottom: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 10,
    marginBottom: 8,
  },
  userRowUnselected: {
    backgroundColor: colors.background,
  },
  userRowSelected: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.accentMuted,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 2,
  },
  checkbox: {
    marginLeft: 12,
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxUnselected: {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  checkboxSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.danger,
    textAlign: "center",
    marginTop: 12,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.background,
    gap: 12,
  },
  footerButton: {
    flex: 1,
    height: 44,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.background,
  },
  submitButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accentText,
  },
});

export default CreateGroup;
