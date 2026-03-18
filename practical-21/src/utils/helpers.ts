import type { Track } from '../types/api';

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const getImageUrl = (path: string): string => {
  return path.startsWith('http') ? path : `http://localhost:5000/${path}`;
};

export const playTrack = (track: Track, audioRef: { current: HTMLAudioElement }): void => {
  audioRef.current.load();
  audioRef.current.src = getImageUrl(track.audioUrl);
  audioRef.current.play();
};
