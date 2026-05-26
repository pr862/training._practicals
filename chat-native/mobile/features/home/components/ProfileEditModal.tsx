import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Camera, X } from "lucide-react-native";
import type { User } from "../../../../packages/data/user/model";
import UserAvatar from "../../../../packages/style/components/UserAvatar";
import { Input } from "../../../../packages/style/components/Input";
import { colors, textStyles } from "../../../../packages/style/theme";
import Button from "../../../../packages/style/components/Button";
import { useProfileEditState } from "./useProfileEditState";

interface ProfileEditModalProps {
  open: boolean;
  user?: User;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (name: string, imageUri?: string | null, removePhoto?: boolean) => Promise<void>;
}

const ProfileEditModal = ({ open, user, isSubmitting = false, onCancel, onSubmit }: ProfileEditModalProps) => {
  const {
    name,
    setName,
    imageUri,
    removePhoto,
    error,
    handlePickImage,
    handleRemovePhoto,
    handleNativeSubmit,
  } = useProfileEditState({ open, user, isSubmitting, onCancel, onSubmit });

  if (!open || !user) return null;

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onCancel} disabled={isSubmitting} style={styles.closeButton}>
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>

            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={handlePickImage} disabled={isSubmitting} style={styles.avatarPickerTrigger}>
                <View style={styles.avatarOuterRing}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                  ) : removePhoto ? (
                    <UserAvatar user={{ ...user, photoURL: "" }} size="lg" />
                  ) : (
                    <UserAvatar user={user} size="lg" />
                  )}
                  <View style={styles.cameraBadge}>
                    <Camera size={14} color={colors.accentText} />
                  </View>
                </View>
              </TouchableOpacity>

              {(imageUri || (user.photoURL && !removePhoto)) ? (
                <TouchableOpacity onPress={handleRemovePhoto} disabled={isSubmitting} style={styles.removePhotoBtn}>
                  <Text style={styles.removePhotoText}>Remove photo</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.inputSpacing}>
              <Input
                label="Display name"
                value={name}
                onChangeText={(text) => setName(text)}
                editable={!isSubmitting}
                maxLength={40}
              />
            </View>

            <View style={styles.inputSpacing}>
              <Input label="Email" value={user.email || ""} editable={false} />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.footer}>
            <Button onPress={onCancel} disabled={isSubmitting} variant="secondary" style={styles.footerButton} textStyle={styles.cancelButtonText}>
              Cancel
            </Button>

            <Button onPress={handleNativeSubmit} loading={isSubmitting} disabled={!name.trim()} style={styles.footerButton} textStyle={styles.saveButtonText}>
              Save
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16
  },
  card: {
    width: "100%",
    maxWidth: 384,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  headerTitle: {
    ...textStyles.button,
    color: colors.text
  },
  closeButton: {
    height: 36,
    width: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  formContainer: {
    maxHeight: 400
  },
  formContent: {
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20
  },
  avatarPickerTrigger: {
    position: "relative"
  },
  avatarOuterRing: {
    position: "relative",
    borderRadius: 999,
    padding: 4
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "cover"
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.accent,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
  },
  removePhotoBtn: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  removePhotoText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.danger
  },
  inputSpacing: {
    marginBottom: 16
  },
  errorText: {
    ...textStyles.error,
    color: colors.danger,
    textAlign: "center",
    marginTop: 8
  }
  ,
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surfaceRaised,
    gap: 12
  },
  footerButton: {
    flex: 1,
    height: 44
  },
  cancelButtonText: {
    ...textStyles.modalbutton,
    color: "#334155"
  },
  saveButtonText: {
    ...textStyles.modalbutton,
    color: colors.accentText
  },
});

export default ProfileEditModal;
