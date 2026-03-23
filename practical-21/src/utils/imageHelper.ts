const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const getImageUrl = (imagePath?: string, fallback: string = 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=No+Image'): string => {
  if (!imagePath) {
    return fallback;
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('uploads/')) {
    return BACKEND_URL + '/' + imagePath;
  }
  if (imagePath.startsWith('/')) {
    return BACKEND_URL + imagePath;
  }
  return BACKEND_URL + '/uploads/' + imagePath;
};
