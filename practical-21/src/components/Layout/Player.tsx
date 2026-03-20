import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pause, play, setProgress, nextTrack, previousTrack, setPlaylist, toggleShuffle, toggleRepeat } from '../../store/playerSlice';
import { formatDuration, playTrack } from '../../utils/helpers';
import type { RootState } from '../../store/store';
import Button from '../UI/Button';

const Player: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, progress, volume, playlist, currentIndex, isShuffle, isRepeat } = useSelector((state: RootState) => state.player);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showQueue, setShowQueue] = useState(false);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log('Player: currentTrack changed to:', currentTrack);
    if (currentTrack && audioRef.current) {
      console.log('Player: Calling playTrack with track:', currentTrack.title);
      playTrack(currentTrack, { current: audioRef.current }, isAuthenticated);
    } else if (!currentTrack && audioRef.current) {
      console.log('Player: No current track, pausing audio');
      audioRef.current.pause();
      audioRef.current.src = '';
    } else if (!currentTrack && !audioRef.current) {
      console.log('Player: No current track and audio element not mounted yet');
    }
  }, [currentTrack]);

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('Progress bar clicked');
    const audio = audioRef.current;
    if (audio && currentTrack) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = (clickX / width) * 100;
      
      console.log('Setting progress to:', percentage, '%');
      audio.currentTime = (percentage / 100) * audio.duration;
      dispatch(setProgress(percentage));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    // Note: Volume state would need to be added to the slice
  };

  const handleShuffle = () => {
    console.log('Shuffle button clicked, current isShuffle:', isShuffle);
    dispatch(toggleShuffle());
  };

  const handleRepeat = () => {
    console.log('Repeat button clicked, current isRepeat:', isRepeat);
    dispatch(toggleRepeat());
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleProgressChange);
      audio.addEventListener('ended', () => {
        console.log('Audio ended, isRepeat:', isRepeat, 'currentIndex:', currentIndex, 'playlist.length:', playlist.length);
        if (isRepeat) {
          console.log('Repeating current track');
          audio.currentTime = 0;
          audio.play();
        } else if (currentIndex < playlist.length - 1) {
          console.log('Playing next track');
          dispatch(nextTrack());
        }
      });
      return () => {
        audio.removeEventListener('timeupdate', handleProgressChange);
        audio.removeEventListener('ended', () => {});
      };
    }
  }, [isRepeat, currentIndex, playlist.length]);

  if (!currentTrack) return null;

  const currentDuration = audioRef.current ? formatDuration(Math.floor(audioRef.current.currentTime)) : '0:00';
  const totalDuration = currentTrack.duration ? formatDuration(currentTrack.duration) : '0:00';

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black text-white shadow-2xl fixed bottom-0 left-0 right-0 z-30">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleProgressChange}
        className="hidden"
      />
      
      {/* Main Player Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center space-x-4">
          {/* Track Info */}
          <img src={currentTrack.image} alt={currentTrack.title} className="w-14 h-14 rounded-lg object-cover shadow-lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm md:text-base truncate">{currentTrack.title}</h3>
            <p className="text-xs md:text-sm text-gray-400 truncate">{currentTrack.artistName}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button onClick={handleShuffle} size="sm" variant={isShuffle ? "primary" : "outline"} className="text-xs">
              🔄
            </Button>
            <Button onClick={() => dispatch(previousTrack())} size="sm" variant="outline">
              ⏮️
            </Button>
            <Button onClick={handleTogglePlay} variant="primary" size="md" className="w-12 h-12">
              {isPlaying ? '⏸️' : '▶️'}
            </Button>
            <Button onClick={() => dispatch(nextTrack())} size="sm" variant="outline">
              ⏭️
            </Button>
            <Button onClick={handleRepeat} size="sm" variant={isRepeat ? "primary" : "outline"} className="text-xs">
              🔁
            </Button>
          </div>

          {/* Progress & Volume */}
          <div className="flex-1 max-w-md space-y-2">
            {/* Progress Bar */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 w-12 text-right">{currentDuration}</span>
              <div 
                className="flex-1 bg-gray-700 rounded-full h-2 relative cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div className="absolute top-0 left-0 bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full" style={{width: `${progress}%`}} />
                <div className="absolute top-0 left-0 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all" style={{left: `calc(${progress}% - 6px)`}} />
              </div>
              <span className="text-xs text-gray-400 w-12">{totalDuration}</span>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">🔊</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-gray-700 rounded-full accent-teal-400"
              />
            </div>
          </div>

          {/* Queue Toggle */}
          <Button 
            onClick={() => setShowQueue(!showQueue)} 
            size="sm" 
            variant="outline"
            className="text-xs"
          >
            📋 Queue
          </Button>
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && (
        <div className="max-w-7xl mx-auto px-4 pb-4 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {playlist.slice(currentIndex, currentIndex + 5).map((track, index) => (
              <div
                key={track.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  index === 0 
                    ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/50' 
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img src={track.image} alt={track.title} className="w-10 h-10 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{track.title}</p>
                    <p className="text-xs text-gray-400 truncate">{track.artistName}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatDuration(track.duration!)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
