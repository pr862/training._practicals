import React, { useState } from 'react';
import type { Artist } from '../../types/artist';
import { Input } from '../ui/Input';
import { ImageUpload } from '../ui/ImageUpload';
import { BaseForm, FormField } from '../ui/BaseForm';
import { useFormValidation } from '../../hooks/useFormValidation';
import { createArtistValidation } from '../../validation/formValidations';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ArtistFormProps {
  artist?: Artist;
  onSubmit: (data: { name: string; image: File | null }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ArtistForm: React.FC<ArtistFormProps> = ({
  artist,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [name, setName] = useState(artist?.name || '');

  const { errors, validate, clearError } = useFormValidation(
    createArtistValidation(!!artist)
  );

  const { image, previewUrl, handleImageChange, removeImage } = useImageUpload(artist?.image_url ?? undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validate({ name, image });
    if (!isValid) return;
    
    await onSubmit({ name, image });
  };

  return (
    <BaseForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={artist ? 'Update Artist' : 'Create Artist'}
      cancelText="Cancel"
      onCancel={onCancel}
    >
      <FormField>
        <Input 
          label={artist ? "Edit Artist Name" : "Artist Name"} 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter artist name"
          error={errors.name}
          disabled={isLoading}
        />
      </FormField>

      <FormField>
        <ImageUpload
          label="Artist Image"
          previewUrl={previewUrl}
          onChange={(file) => {
            if (file) {
              const syntheticEvent = {
                target: {
                  files: [file]
                }
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              handleImageChange(syntheticEvent);
            } else {
              removeImage();
            }
          }}
          onRemove={removeImage}
          error={errors.image}
          disabled={isLoading}
        />
      </FormField>
    </BaseForm>
  );
};
