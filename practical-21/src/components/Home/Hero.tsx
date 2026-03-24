import React, { useMemo } from 'react';
import { useTracks } from '../../hooks/useTracks';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Shuffle } from 'lucide-react';
import Button from '../UI/Button';
import { playTrack, setQueue, setShuffle } from '../../store/playerSlice';
import type { RootState } from '../../store/store';

const Hero: React.FC = () => {
  const { tracks, loading } = useTracks();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const playable = useMemo(() => (tracks || []).filter((t) => Boolean(t.audioUrl)), [tracks]);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
  );

  const startPlayback = (mode: 'play' | 'shuffle') => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (playable.length === 0) return;

    const startIndex = mode === 'shuffle' ? Math.floor(Math.random() * playable.length) : 0;
    dispatch(setShuffle(mode === 'shuffle'));
    dispatch(setQueue({ tracks: playable, startIndex }));
    dispatch(playTrack(playable[startIndex]));
    navigate(`/app/tracks/${playable[startIndex].id}`);
  };

  return (
    <section className="relative h-[26rem] rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-24 overflow-hidden border border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-black to-emerald-500/10" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative h-full flex flex-col justify-center px-6 sm:px-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold max-w-2xl">
          Discover your next favourite track
        </h1>
        <p className="mt-3 text-white/70 max-w-xl">
          Play instantly or shuffle through trending music.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => startPlayback('play')}
            disabled={playable.length === 0}
            className="bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 text-black font-semibold px-6 py-3 rounded-full"
          >
            <span className="inline-flex items-center gap-2">
              <Play className="w-4 h-4" /> Play
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={() => startPlayback('shuffle')}
            disabled={playable.length === 0}
            className="px-6 py-3 rounded-full"
          >
            <span className="inline-flex items-center gap-2">
              <Shuffle className="w-4 h-4" /> Shuffle
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
