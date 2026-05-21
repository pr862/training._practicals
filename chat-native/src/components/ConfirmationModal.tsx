import React, { useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { colors } from "../constants/theme";
import Button from "./Button";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

type ConfirmationDialogProps = Omit<ConfirmationModalProps, "open">;

const ConfirmationDialog = ({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  variant = "danger",
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) => {
  const [error, setError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const handleCancel = () => {
    if (isConfirming) return;
    setError("");
    onCancel();
  };

  const handleConfirm = async () => {
    if (isConfirming) return;
    setError("");
    setIsConfirming(true);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed.");
    } finally {
      setIsConfirming(false);
    }
  };

  const isDanger = variant === "danger";

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.buttonContainer}>
          <Button
            onPress={handleCancel}
            disabled={isConfirming}
            variant="secondary"
            style={styles.button}
            textStyle={styles.cancelButtonText}
          >
            {cancelLabel}
          </Button>

          <Button
            onPress={handleConfirm}
            loading={isConfirming}
            variant={isDanger ? "danger" : "primary"}
            style={styles.button}
            textStyle={!isDanger ? styles.primaryConfirmButtonText : styles.confirmButtonText}
          >
            {confirmLabel}
          </Button>
        </View>
      </View>
    </View>
  );
};

const ConfirmationModal = ({ open, ...props }: ConfirmationModalProps) => {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={props.onCancel}>
      <ConfirmationDialog {...props} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 384,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: "#fff1f2",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.danger,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600"
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  primaryConfirmButtonText: {
    color: colors.accentText,
  },
});

export default ConfirmationModal;
