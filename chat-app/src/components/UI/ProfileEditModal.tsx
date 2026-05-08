import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, Loader2, X } from "lucide-react";
import type { User } from "../../types/user";
import UserAvatar from "./UserAvatar";
import { Input } from "./Input";
import { validateName, validateProfileImage } from "../../utils/validation";

interface ProfileEditModalProps {
  open: boolean;
  user?: User;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (name: string, file?: File | null, removePhoto?: boolean) => Promise<void>;
}

type ProfileEditFormProps = Omit<ProfileEditModalProps, "open" | "user"> & {
  user: User;
};

const ProfileEditForm = ({ user, isSubmitting = false, onCancel, onSubmit }: ProfileEditFormProps) => {
  const [name, setName] = useState(user.name || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [removePhoto, setRemovePhoto] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0] ?? null;
    e.target.value = "";
    const imageError = validateProfileImage(nextFile);
    if (imageError) {
      setError(imageError);
      return;
    }
    if (!nextFile) return;

    if (preview) URL.revokeObjectURL(preview);
    setError("");
    setFile(nextFile);
    setRemovePhoto(false);
    setPreview(URL.createObjectURL(nextFile));
  };

  const handleRemovePhoto = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    setRemovePhoto(true);
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const nameError = validateName(trimmedName);
    if (nameError) {
      setError(nameError);
      return;
    }

    try {
      setError("");
      await onSubmit(trimmedName, file, removePhoto);
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-md sm:py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-bold text-slate-950">Edit Profile</h3>
          <button type="button" onClick={onCancel} className="flex size-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <label className="mx-auto block w-fit cursor-pointer">
            <div className="relative">
              {preview ? (
                <img src={preview} alt="Profile preview" className="size-20 rounded-full object-cover ring-4 ring-cyan-50" />
              ) : removePhoto ? (
                <UserAvatar user={{ ...user, photoURL: "" }} size="lg" className="size-20 ring-4 ring-cyan-50" />
              ) : (
                <UserAvatar user={user} size="lg" className="size-20 ring-4 ring-cyan-50" />
              )}
              <span className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-cyan-700 text-white shadow-md">
                <Camera size={15} />
              </span>
            </div>
            <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} disabled={isSubmitting} />
          </label>
          {(preview || (user.photoURL && !removePhoto)) && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={isSubmitting}
              className="mx-auto block rounded-lg px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
            >
              Remove photo
            </button>
          )}

          <Input
            label="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            maxLength={40}
          />
          <Input
          label="Email"
          value={user.email}
          onChange={() => undefined}
          disabled
          />

          {error && <p className="text-center text-xs font-semibold text-rose-600">{error}</p>}
        </div>

        <div className="flex gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4">
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-60">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || !name.trim()} className="flex-1 rounded-xl bg-cyan-900 py-2.5 text-sm font-bold text-white hover:bg-cyan-800 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="mx-auto size-4 animate-spin" /> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

const ProfileEditModal = ({ open, user, isSubmitting = false, onCancel, onSubmit }: ProfileEditModalProps) => {
  if (!open || !user) return null;

  return createPortal(
    <ProfileEditForm
      key={`${user.uid}-${open ? "open" : "closed"}`}
      user={user}
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />,
    document.body
  );
};

export default ProfileEditModal;
