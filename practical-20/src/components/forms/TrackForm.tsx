import React, { useMemo, useState } from 'react';
import type { Album } from '../../types/album';
import type { Track } from '../../types/track';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ImageUpload } from '../ui/ImageUpload';
import { BaseForm, FormSection, FormField } from '../ui/BaseForm';
import { useFormValidation } from '../../hooks/useFormValidation';
import { createTrackValidation } from '../../validation/formValidations';
import { useImageUpload } from '../../hooks/useImageUpload';

export type TrackFormValues = {
  name: string;
  album_id: number;
  index: number;
  is_published: boolean;
  trackFile: File | null;
  image: File | null;
};

type TrackFormProps = {
  track?: Track;
  albums: Album[];
  onSubmit: (values: TrackFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export const TrackForm: React.FC<TrackFormProps> = ({
  track,
  albums,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [name, setName] = useState(track?.name ?? '');
  const [albumId, setAlbumId] = useState<number | ''>(() => track?.album_id ?? '');
  const [index, setIndex] = useState(track?.index != null ? String(track.index) : '');
  const [isPublished, setIsPublished] = useState(Boolean(track?.is_published));
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const { errors, validate } = useFormValidation(
    createTrackValidation(!!track)
  );

  const { image, previewUrl, handleImageChange, removeImage } = useImageUpload(track?.image_url ?? undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validate({ name, albumId, index, trackFile: audioFile, image });
    if (!isValid) return;
    
    await onSubmit({
      name: name.trim(),
      album_id: Number(albumId),
      index: Number(index),
      is_published: isPublished,
      trackFile: audioFile,
      image,
    });
  };

  const audioSrc = track?.track_url ?? null;

  return (
    <BaseForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={track ? 'Update Track' : 'Create Track'}
      cancelText="Cancel"
      onCancel={onCancel}
    >
      <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
        <FormSection>
          <Input
            label="Track Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            disabled={isLoading}
          />
          <Select
            label="Album"
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value ? Number(e.target.value) : '')}
            error={errors.albumId}
          >
            <option value="" disabled>Select album</option>
            {albums.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </Select>
          <Input
            label="Track Index"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            hint="Track position in album"
            error={errors.index}
            disabled={isLoading}
          />
          <div className="flex items-end py-2">
            <Checkbox
              label="Published"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
          </div>
        </FormSection>

        <FormField>
          <label className="block text-sm font-medium text-white/80">Audio File</label>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.flac,.ogg"
                onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                className="hidden"
                id="trackAudioUpload"
                disabled={isLoading}
              />
              <label
                htmlFor="trackAudioUpload"
                className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-white/25 transition bg-neutral-900/60"
              >
                <span className="text-sm text-white/80">Click to upload audio</span>
                <span className="text-xs text-white/45 mt-1">MP3, WAV, FLAC, OGG (Max 50MB)</span>
              </label>

              {audioFile ? (
                <p className="mt-2 text-xs text-green-400 truncate">
                  {audioFile.name}
                </p>
              ) : audioSrc ? (
                <p className="mt-2 text-xs text-blue-400 truncate">
                  {audioSrc.split('/').pop()?.split('?')[0]}
                </p>
              ) : null}

              {!audioFile && audioSrc && (
                <audio controls className="mt-2 w-full">
                  <source src={audioSrc} />
                </audio>
              )}

              {errors.trackFile && (
                <p className="mt-2 text-xs text-rose-400">{errors.trackFile}</p>
              )}
            </div>
            {audioFile && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setAudioFile(null);
                }}
                disabled={isLoading}
              >
                Remove
              </Button>
            )}
          </div>
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