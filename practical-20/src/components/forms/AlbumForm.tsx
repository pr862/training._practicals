import React, { useMemo, useState } from 'react';
import type { Album } from '../../types/album';
import type { Artist } from '../../types/artist';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Checkbox } from '../ui/Checkbox';
import { ImageUpload } from '../ui/ImageUpload';
import { BaseForm, FormSection, FormField } from '../ui/BaseForm';
import { useFormValidation } from '../../hooks/useFormValidation';
import { createAlbumValidation } from '../../validation/formValidations';
import { useImageUpload } from '../../hooks/useImageUpload';

export type AlbumFormValues = {
  name: string;
  description: string;
  published_at: string;
  is_published: boolean;
  artist_id: number;
  image: File | null;
};

type AlbumFormProps = {
  album?: Album;
  artists: Artist[];
  onSubmit: (values: AlbumFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export const AlbumForm: React.FC<AlbumFormProps> = ({ album, artists, onSubmit, onCancel, isLoading = false }) => {
  const [name, setName] = useState(album?.name ?? '');
  const [description, setDescription] = useState(album?.description ?? '');
  const [publishedAt, setPublishedAt] = useState(album?.published_at ?? '');
  const [isPublished, setIsPublished] = useState(Boolean(album?.is_published));
  const [artistId, setArtistId] = useState<number | ''>(() => album?.artist_id ?? '');

  const { errors, validate } = useFormValidation(
    createAlbumValidation(!!album)
  );

  const { image, previewUrl, handleImageChange, removeImage } = useImageUpload(album?.image_url ?? undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate({ name, artistId, publishedAt, description, image });
    if (!isValid) return;

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      published_at: publishedAt.trim(),
      is_published: isPublished,
      artist_id: Number(artistId),
      image,
    });
  };

  return (
    <BaseForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={album ? 'Update Album' : 'Create Album'}
      cancelText="Cancel"
      onCancel={onCancel}
    >
      <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
        <FormSection>
          <Input
            label="Album Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            disabled={isLoading}
          />

          <Select
            label="Artist"
            value={artistId}
            onChange={(e) => setArtistId(e.target.value ? Number(e.target.value) : '')}
            error={errors.artistId}
          >
            <option value="" disabled>Select artist</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </Select>

          <Input
            label="Published At"
            placeholder="2026-03-17"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            hint="Format: YYYY-MM-DD"
            error={errors.publishedAt}
            disabled={isLoading}
          />

          <div className="flex items-end py-2">
            <Checkbox label="Published" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
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
        <div className="h-4" />
      </div>
    </BaseForm>
  );
};