import type { Track } from '../types/api';
import { getImageUrl } from './imageHelper';

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const playTrack = async (
  track: Track,
  audioRef: { current: HTMLAudioElement },
  options?: { autoplay?: boolean }
): Promise<void> => {
  if (!track.audioUrl) {
    throw new Error('Missing audio URL');
  }

  const audio = audioRef.current;

  audio.src = getImageUrl(track.audioUrl);
  audio.preload = 'metadata';
  audio.load();

  await new Promise<void>((resolve, reject) => {
    const onLoaded = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('Failed to load audio'));
    };
    const cleanup = () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('error', onError);
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('error', onError);
  });

  if (options?.autoplay === false) {
    return;
  }

  try {
    await audio.play();
  } catch (error: unknown) {
    if (typeof error === 'object' && error && 'name' in error && (error as { name?: string }).name === 'AbortError') {
      return;
    }
    throw error;
  }
};
