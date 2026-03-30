import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ListMusic,
  Pause as PauseIcon,
  Play as PlayIcon,
  Repeat as RepeatIcon,
  Shuffle as ShuffleIcon,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
} from 'lucide-react';
import {
  pause,
  play,
  setProgress,
  nextTrack,
  previousTrack,
  setVolume,
  toggleShuffle,
  toggleRepeat,
  playTrack as playTrackAction,
} from '../../store/playerSlice';
import { formatDuration, playTrack } from '../../utils/helpers';
import type { RootState } from '../../store/store';
import { useFavourites } from '../../hooks/useFavourites';

const Player: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, progress, volume, playlist, currentIndex, isShuffle, isRepeat } = useSelector((state: RootState) => state.player);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastLoadedTrackIdRef = useRef<number | null>(null);
  const [showQueue, setShowQueue] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const {
    loading: favouritesLoading,
    isFavouriteTrack,
    toggleFavouriteByTrackId,
  } = useFavourites({ enabled: isAuthenticated });

  const safePlay = (audio: HTMLAudioElement) => {
    const promise = audio.play();
    promise?.catch((e: any) => {
      if (e?.name === 'AbortError') return;
      setAudioError(e instanceof Error ? e.message : 'Failed to play audio');
      dispatch(pause());
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      lastLoadedTrackIdRef.current = null;
      return;
    }

    if (lastLoadedTrackIdRef.current === currentTrack.id) return;
    lastLoadedTrackIdRef.current = currentTrack.id;

    audio.pause();
    audio.currentTime = 0;
    dispatch(setProgress(0));

    setAudioError(null);
    void playTrack(currentTrack, { current: audio }, isAuthenticated, { autoplay: isPlaying }).catch((e) => {
      setAudioError(e instanceof Error ? e.message : 'Failed to play audio');
      dispatch(pause());
    });
  }, [currentTrack?.id, dispatch, isAuthenticated, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      safePlay(audio);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack?.id]);

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      dispatch(pause());
      audio?.pause();
    } else {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      dispatch(play());
      if (audio) safePlay(audio);
    }
  };

  const handleProgressChange = () => {
    const audio = audioRef.current;
    if (audio) {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      const newProgress = (audio.currentTime / audio.duration) * 100;
      if (Number.isFinite(newProgress)) {
        dispatch(setProgress(newProgress));
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (audio && currentTrack) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = (clickX / width) * 100;

      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      audio.currentTime = (percentage / 100) * audio.duration;
      dispatch(setProgress(percentage));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    dispatch(setVolume(newVolume));
  };

  const handleShuffle = () => {
    dispatch(toggleShuffle());
  };

  const handleRepeat = () => {
    dispatch(toggleRepeat());
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        if (isRepeat) {
          audio.currentTime = 0;
          if (isPlaying) {
            safePlay(audio);
          }
          return;
        }
        dispatch(nextTrack());
      };

      audio.addEventListener('timeupdate', handleProgressChange);
      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.removeEventListener('timeupdate', handleProgressChange);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [dispatch, handleProgressChange, isRepeat, isPlaying]);

  if (!currentTrack) return null;

  const currentDuration = audioRef.current ? formatDuration(Math.floor(audioRef.current.currentTime)) : '0:00';
  const totalDuration = currentTrack.duration
    ? formatDuration(currentTrack.duration)
    : audioRef.current && Number.isFinite(audioRef.current.duration) && audioRef.current.duration > 0
      ? formatDuration(Math.floor(audioRef.current.duration))
      : '0:00';
  const isFavourited = isFavouriteTrack(currentTrack.id);

  return (
    <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-black text-white shadow-2xl fixed bottom-0 left-0 right-0 z-30 border-t border-white/10">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleProgressChange}
        onError={() => {
          setAudioError('Audio failed to load (check audio URL / backend).');
          dispatch(pause());
        }}
        preload="metadata"
        className="hidden"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(`/app/tracks/${currentTrack.id}`)}
              className="flex items-center gap-3 min-w-0 hover:opacity-90 transition-opacity"
              title="Open track"
            >
              <img src={currentTrack.image} alt={currentTrack.title} className="w-14 h-14 rounded-xl object-cover shadow-lg ring-1 ring-white/10" />
              <div className="flex flex-col items-start min-w-0">
                <h3 className="font-semibold text-sm md:text-base truncate max-w-[12rem] md:max-w-[16rem]">{currentTrack.title}</h3>
              </div>
            </button>

            <button
              type="button"
              disabled={favouritesLoading}
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login');
                  return;
                }
                void toggleFavouriteByTrackId(currentTrack.id, currentTrack.title);
              }}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full border transition-colors ${
                isFavourited
                  ? 'border-pink-500/40 bg-pink-500/10 text-pink-300 hover:bg-pink-500/15'
                  : 'border-white/10 hover:bg-white/5 text-gray-200'
              } ${favouritesLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              title={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
              aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
            >
              <Heart className="w-4 h-4" fill={isFavourited ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="flex flex-col flex-1 items-center gap-2 min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className={`hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                  isShuffle ? 'bg-teal-500/20 text-teal-300' : 'hover:bg-white/10 text-gray-300'
                }`}
                title="Shuffle"
              >
                <ShuffleIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => dispatch(previousTrack())}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors text-gray-200"
                title="Previous"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-black hover:bg-white/90 transition-colors shadow-lg"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={() => dispatch(nextTrack())}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors text-gray-200"
                title="Next"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={handleRepeat}
                className={`hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                  isRepeat ? 'bg-teal-500/20 text-teal-300' : 'hover:bg-white/10 text-gray-300'
                }`}
                title="Repeat"
              >
                <RepeatIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full max-w-xl flex items-center gap-2">
              <span className="text-[11px] text-gray-400 w-10 text-right tabular-nums">{currentDuration}</span>
              <div
                className="flex-1 bg-white/10 rounded-full h-1.5 relative cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div
                  className="absolute top-0 left-0 bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>
              <span className="text-[11px] text-gray-400 w-10 tabular-nums">{totalDuration}</span>
            </div>

            {audioError ? (
              <div className="text-[11px] text-rose-300/90 w-full max-w-xl truncate">
                {audioError}
              </div>
            ) : null}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 w-40">
              <Volume2 className="w-4 h-4 text-gray-300" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-gray-700 rounded-full accent-teal-400"
              />
            </div>

            <button
              onClick={() => setShowQueue(!showQueue)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
                showQueue ? 'border-teal-400/40 bg-teal-500/10 text-teal-200' : 'border-white/10 hover:bg-white/5 text-gray-200'
              }`}
              title="Queue"
            >
              <ListMusic className="w-4 h-4" />
              <span className="text-xs">Queue</span>
            </button>
          </div>
        </div>
      </div>

      {showQueue && (
        <div className="max-w-7xl mx-auto px-4 pb-4 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {playlist.slice(currentIndex, currentIndex + 5).map((track, index) => (
              <div
                key={track.id}
                onClick={() => dispatch(playTrackAction(track))}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  index === 0 
                    ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/50' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img src={track.image} alt={track.title} className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/10" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{track.title}</p>
                    <p className="text-xs text-gray-400 truncate">{track.artistName ?? 'Unknown Artist'}</p>
                  </div>
                  {typeof track.duration === 'number' ? (
                    <span className="text-xs text-gray-400">{formatDuration(track.duration)}</span>
                  ) : null}
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
