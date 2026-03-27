const getAssetsBaseUrl = (): string => 
  import.meta.env.VITE_ASSETS_BASE_URL as string ?? 'http://localhost:3000';

const normalizeUploadPath = (path: string): string => {
  return path
    .replace('/uploads/albums/images/', '/uploads/albums/')
    .replace('/uploads/playlists/images/', '/uploads/playlists/');
};

export const assetUrl = (pathOrUrl: string | null | undefined): string | null => {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
  const normalized = normalizeUploadPath(pathOrUrl);
  return `${getAssetsBaseUrl()}${normalized.startsWith('/') ? '' : '/'}${normalized}`;
};

