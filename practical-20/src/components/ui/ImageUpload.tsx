import React, { useRef, useState } from 'react';
import { Button } from './Button';

interface ImageUploadProps {
  label?: string;
  previewUrl?: string | null;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  error?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  maxSizeMessage?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = "Cover Image",
  previewUrl,
  onChange,
  onRemove,
  error,
  disabled = false,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, 
  maxSizeMessage = "Image file size must be less than 5MB"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > maxSize) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    onChange(file);
  };

  const handleFileSelect = (file: File | null) => {
    onChange(file);
  };

  const handleImageRemove = () => {
    onChange(null);
    if (onRemove) onRemove();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-2">{label}</label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/60">
            {previewUrl && <img className="h-full w-full object-cover" src={previewUrl} alt="Cover preview" />}
          </div>
          {previewUrl && (
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={handleImageRemove} 
              disabled={disabled}
            >
              Remove
            </Button>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleImageChange}
            disabled={disabled}
            className="hidden"
            id="imageUpload"
          />
          <label
            htmlFor="imageUpload"
            className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-white/25 transition bg-neutral-900/60"
          >
            <span className="text-sm text-white/80">Click to upload cover</span>
            <span className="text-xs text-white/45 mt-1">JPG, PNG, GIF (Max {Math.round(maxSize / (1024 * 1024))}MB)</span>
          </label>
          {previewUrl && (
            <p className="mt-2 text-xs text-green-400 truncate">
              {previewUrl.includes('blob:') ? 'Selected file' : 'Image uploaded'}
            </p>
          )}
          {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
        </div>
      </div>
    </div>
  );
};