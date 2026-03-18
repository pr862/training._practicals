import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pause, play, setProgress, nextTrack, previousTrack } from '../../store/playerSlice';
import { formatDuration, playTrack } from '../../utils/helpers';
import type { RootState } from '../../store/store';
import Button from '../UI/Button';

const Player: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, progress } = useSelector((state: RootState) => state.player);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (currentTrack && isPlaying && audioRef.current) {
      playTrack(currentTrack, { current: audioRef.current! });
    }
  }, [currentTrack, isPlaying]);

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      dispatch(pause());
      audio?.pause();
    } else {
      dispatch(play());
      audio?.play();
    }
  };

  const handleProgressChange = () => {
    const audio = audioRef.current;
    if (audio) {
      const newProgress = (audio.currentTime / audio.duration) * 100;
      dispatch(setProgress(newProgress));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleProgressChange);
      return () => audio.removeEventListener('timeupdate', handleProgressChange);
    }
  }, []);

  if (!currentTrack) return null;

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black text-white p-4 shadow-2xl fixed bottom-0 left-0 right-0 z-30">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleProgressChange}
        className="hidden"
      />
      <div className="max-w-6xl mx-auto flex items-center space-x-4">
        <img src={currentTrack.image} alt={currentTrack.title} className="w-12 h-12 rounded object-cover" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400 truncate">{currentTrack.artist.name}</p>
        </div>
        <div className="flex items-center space-x-2 flex-1 max-w-md">
      <Button onClick={() => dispatch(previousTrack())} size="sm" variant="outline">⏮️</Button>
          <Button onClick={handleTogglePlay} variant="primary" size="sm" className="w-12 h-12">
            {isPlaying ? '⏸️' : '▶️'}
          </Button>
          <Button onClick={() => dispatch(nextTrack())} size="sm" variant="outline">⏭️</Button>
        </div>
        <div className="flex items-center space-x-2 w-64">
          <span className="text-xs text-gray-400">0:00</span>
          <div className="flex-1 bg-gray-700 rounded-full h-1 relative cursor-pointer hover:h-2 transition-all">
            <div className="absolute top-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" style={{width: `${progress}%`}} />
          </div>
          <span className="text-xs text-gray-400">{formatDuration(currentTrack.duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default Player;
