import type { Track } from '../types/api';

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const getImageUrl = (path: string | undefined): string => {
  if (!path) {
    return 'https://via.placeholder.com/300x300/667eea/ffffff?text=No+Image';
  }
  return path.startsWith('http') ? path : `http://localhost:5000/${path}`;
};

import { useNavigate } from 'react-router-dom';

export const usePlayTrack = (audioRef: React.RefObject<HTMLAudioElement>, isAuthenticated: boolean) => {
  const navigate = useNavigate();

  return (track: Track) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    audioRef.current?.load();
    audioRef.current!.src = getImageUrl(track.audioUrl);
    audioRef.current?.play();
  };
};

export const playTrack = async (track: Track, audioRef: { current: HTMLAudioElement }, isAuthenticated: boolean): Promise<void> => {
  if (!isAuthenticated) {
    return;
  }
  
  try {
    // Set the source first
    audioRef.current.src = getImageUrl(track.audioUrl);
    
    // Wait for metadata to load before playing
    await new Promise<void>((resolve, reject) => {
      audioRef.current.onloadedmetadata = () => resolve();
      audioRef.current.onerror = () => reject(new Error('Failed to load audio'));
    });
    
    // Now play the audio
    await audioRef.current.play();
    console.log('Audio playback started successfully for track:', track.title);
  } catch (error) {
    console.error('Error playing track:', error);
  }
};
