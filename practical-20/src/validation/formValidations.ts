import { validationRules } from '../hooks/useFormValidation';

const validatePublishedAt = (value: string) => {
  if (!value) return 'Publication date is required';

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) return 'Publication date must be in YYYY-MM-DD format';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Please enter a valid publication date';

  return undefined;
};

export const albumValidation = {
  name: validationRules.required('Album name is required'),
  artistId: validationRules.required('Please select an artist'),
  publishedAt: validatePublishedAt,
  description: validationRules.required('Album description is required'),
  image: (file: File | null) => {
    if (!file) return 'Album cover image is required';
    if (file && file.size > 5 * 1024 * 1024) return 'Image file size must be less than 5MB';
    return undefined;
  },
};

export const trackValidation = {
  name: validationRules.required('Track name is required'),
  albumId: validationRules.required('Please select an album'),
  index: validationRules.required('Track index is required'),
  trackFile: (file: File | null) => {
    if (!file) return 'Audio file is required';
    if (file && file.size > 50 * 1024 * 1024) return 'Audio file size must be less than 50MB';
    return undefined;
  },
  image: (file: File | null) => {
    if (!file) return 'Track cover image is required';
    if (file && file.size > 5 * 1024 * 1024) return 'Image file size must be less than 5MB';
    return undefined;
  },
};

export const playlistValidation = {
  name: validationRules.required('Playlist name is required'),
  description: validationRules.required('Playlist description is required'),
  image: (file: File | null) => {
    if (!file) return 'Playlist cover image is required';
    if (file && file.size > 5 * 1024 * 1024) return 'Image file size must be less than 5MB';
    return undefined;
  },
};

export const artistValidation = {
  name: validationRules.required('Artist name is required'),
  image: (file: File | null) => {
    if (!file) return 'Artist image is required';
    if (file && file.size > 5 * 1024 * 1024) return 'Image file size must be less than 5MB';
    return undefined;
  },
};

export const loginValidation = {
  email: validationRules.required('Email is required'),
  password: validationRules.required('Password is required'),
};

export const registerValidation = {
  name: validationRules.required('Name is required'),
  email: validationRules.required('Email is required'),
  password: (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    return undefined;
  },
  confirmPassword: (value: string, password: string) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return undefined;
  },
};

export type ValidationSchema<T> = {
  [K in keyof T]?: (value: T[K]) => string | undefined;
};

export const createAlbumValidation = (isEditing: boolean) => ({
  name: validationRules.required('Album name is required'),
  artistId: validationRules.required('Please select an artist'),
  publishedAt: validatePublishedAt,
  description: validationRules.required('Album description is required'),
  image: (file: File | null) => {
    if (!isEditing && !file) return 'Album cover image is required';
    if (file && file.size > 5 * 1024 * 1024) return 'Image file size must be less than 5MB';
    return undefined;
  },
});

export const createTrackValidation = (isEditing: boolean) => ({
  name: validationRules.required('Track name is required'),
  albumId: validationRules.required('Please select an album'),
  index: validationRules.required('Track index is required'),
  trackFile: (file: File | null) => {
    if (!isEditing && !file) return 'Audio file is required';
    if (file && file.size > 50 * 1024 * 1024) return 'Audio file size must be less than 50MB';
    return undefined;
  },
  image: (file: File | null) => {
    if (!isEditing && !file) return 'Track cover image is required';
    if (file && file.size > 5 * 1024 * 1024) return 'Image file size must be less than 5MB';
    return undefined;
  },
});

export const createPlaylistValidation = (isEditing: boolean) => ({
  name: validationRules.required('Playlist name is required'),
  description: validationRules.required('Playlist description is required'),
  image: (file: File | null) => {
    if (!isEditing && !file) return 'Playlist cover image is required';
    if (file && file.size > 5 * 1024 * 1024) return 'Image file size must be less than 5MB';
    return undefined;
  },
});

export const createArtistValidation = (isEditing: boolean) => ({
  name: validationRules.required('Artist name is required'),
  image: (file: File | null) => {
    if (!isEditing && !file) return 'Artist image is required';
    if (file && file.size > 5 * 1024 * 1024) return 'Image file size must be less than 5MB';
    return undefined;
  },
});