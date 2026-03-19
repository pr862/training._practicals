import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { play, setPlaylist } from '../../store/playerSlice';
import type { RootState } from '../../store/store';
import type { Track } from '../../types/api';
import Button from '../UI/Button';
import Loading from '../UI/Loading';

interface TrackPlayerProps {
  track: Track;
  tracks?: Track[];
}

const TrackPlayer: React.FC<TrackPlayerProps> = ({ track, tracks = [] }) => {
  const dispatch = useDispatch();
  const { currentTrack } = useSelector((state: RootState) => state.player);
  const isCurrent = currentTrack?.id === track.id;
  const [loading, setLoading] = React.useState(false);

  const handlePlay = async () => {
    setLoading(true);
    if (tracks.length > 0) {
      dispatch(setPlaylist(tracks));
    }
    dispatch(play());
    setLoading(false);
  };

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-96 mx-4 z-20 border border-white/50">
      <div className="flex items-center space-x-4">
        <img src={track.image} alt={track.title} className="w-20 h-20 rounded-xl shadow-lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold line-clamp-1">{track.title}</h3>
<p className="text-sm text-gray-600">{track.artistName}</p>
        </div>
        <Button 
          onClick={handlePlay} 
          variant={isCurrent ? 'secondary' : 'primary'} 
          size="sm"
          disabled={loading}
          className="flex-shrink-0"
        >
          {loading ? <Loading /> : isCurrent ? 'Playing' : 'Play'}
        </Button>
      </div>
    </div>
  );
};

export default TrackPlayer;
