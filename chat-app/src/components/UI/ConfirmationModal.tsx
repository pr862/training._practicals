import { useState } from "react";
import { Loader2 } from "lucide-react";
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

const ConfirmationDialog = ({ title, description, confirmLabel, cancelLabel = "Cancel", variant = "danger", onCancel, onConfirm }: ConfirmationDialogProps) => {
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

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-in fade-in zoom-in rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 duration-200">
        <h3 className="mb-2 text-xl font-bold text-slate-950">{title}</h3>
        <p className="mb-6 text-sm leading-relaxed text-slate-500">{description}</p>
        {error && <p className="mb-4 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleCancel} disabled={isConfirming} className="flex-1">{cancelLabel}</Button>
          <Button variant={variant === "danger" ? "danger" : "primary"} onClick={handleConfirm} disabled={isConfirming} className="flex-1">
            {isConfirming ? <Loader2 className="size-4 animate-spin" /> : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ open, ...props }: ConfirmationModalProps) => {
  if (!open) return null;

  return <ConfirmationDialog {...props} />;
};

export default ConfirmationModal;
