import React, { useMemo, useState } from 'react';
import type { Playlist } from '../../types/playlist';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { ImageUpload } from '../ui/ImageUpload';
import { BaseForm, FormSection, FormField } from '../ui/BaseForm';
import { useFormValidation } from '../../hooks/useFormValidation';
import { createPlaylistValidation } from '../../validation/formValidations';
import { useImageUpload } from '../../hooks/useImageUpload';

export type PlaylistFormValues = {
  name: string;
  description: string;
  is_published: boolean;
  image: File | null;
};

type PlaylistFormProps = {
  playlist?: Playlist;
  onSubmit: (values: PlaylistFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export const PlaylistForm: React.FC<PlaylistFormProps> = ({ playlist, onSubmit, onCancel, isLoading = false }) => {
  const [name, setName] = useState(playlist?.name ?? '');
  const [description, setDescription] = useState(playlist?.description ?? '');
  const [isPublished, setIsPublished] = useState(Boolean(playlist?.is_published));

  const { errors, validate, clearError } = useFormValidation(
    createPlaylistValidation(!!playlist)
  );

  const { image, previewUrl, handleImageChange, removeImage } = useImageUpload(playlist?.image_url ?? undefined);

  const canSubmit = useMemo(() => Boolean(name.trim()) && !isLoading, [isLoading, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validate({ name, description, image });
    if (!isValid) return;
    
    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      is_published: isPublished,
      image,
    });
  };

  return (
    <BaseForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={playlist ? 'Update Playlist' : 'Create Playlist'}
      cancelText="Cancel"
      onCancel={onCancel}
    >
      <FormSection>
        <Input
          label="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={isLoading}
        />

        <div className="flex items-end">
          <Checkbox
            label="Published"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>
      </FormSection>

      <FormField>
        <Textarea
          label="Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
        />
      </FormField>

      <FormField>
        <ImageUpload
          label="Cover Image"
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
