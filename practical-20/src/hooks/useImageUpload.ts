import { useState, useRef, useCallback } from 'react';

export const useImageUpload = (initialUrl?: string) => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const removeImage = useCallback(() => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const clearImage = useCallback(() => {
    removeImage();
  }, [removeImage]);

  const resetImage = useCallback((newInitialUrl?: string) => {
    setImage(null);
    setPreviewUrl(newInitialUrl ?? null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return {
    image,
    previewUrl,
    fileInputRef,
    handleImageChange,
    removeImage,
    clearImage,
    resetImage
  };
};

export type ImageUploadState = ReturnType<typeof useImageUpload>;