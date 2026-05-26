import { useState } from "react";

export function useConfirmationModalState(onCancel: () => void, onConfirm: () => void | Promise<void>) {
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

  return {
    error,
    isConfirming,
    handleCancel,
    handleConfirm,
  };
}
