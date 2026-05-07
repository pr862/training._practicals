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

const ConfirmationModal = ({ open, title, description, confirmLabel, cancelLabel = "Cancel", variant = "danger", onCancel, onConfirm }: ConfirmationModalProps) => {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-in fade-in zoom-in rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 duration-200">
        <h3 className="mb-2 text-xl font-bold text-slate-950">{title}</h3>
        <p className="mb-6 text-sm leading-relaxed text-slate-500">{description}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel} className="flex-1">{cancelLabel}</Button>
          <Button variant={variant === "danger" ? "danger" : "primary"} onClick={onConfirm} className="flex-1">{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationModal;