import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { usePlaylists } from '../hooks/usePlaylists';
import PlaylistModal from '../components/UI/PlaylistModal';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import TrackList from '../components/Tracks/TrackList';
import { Play, Shuffle } from 'lucide-react';
import { playTrack, setQueue } from '../store/playerSlice';
import type { RootState } from '../store/store';
import type { Playlist } from '../types/api';
import Loading from '../components/UI/Loading';

const PlaylistsPage: React.FC = () => {
  const { playlists, loading, error } = usePlaylists();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState<Playlist | null>(null);
  const [filter, setFilter] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return playlists;
    return playlists.filter((p) => (p.title || '').toLowerCase().includes(q));
  }, [filter, playlists]);

  const openDetails = (playlist: Playlist) => {
    setSelected(playlist);
    setDetailsOpen(true);
  };

  const playPlaylist = (playlist: Playlist, mode: 'play' | 'shuffle') => {
    const tracks = playlist.tracks || [];
    if (tracks.length === 0) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/app/playlists' } } });
      return;
    }

    const startIndex = mode === 'shuffle' ? Math.floor(Math.random() * tracks.length) : 0;
    dispatch(setQueue({ tracks, startIndex }));
    dispatch(playTrack(tracks[startIndex]));
  };

  return (
    <div className="p-6 space-y-6">
      {error && <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>}
      
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Playlists</h1>
            <p className="mt-1 text-sm text-white/60">Create playlists, then play or shuffle them anytime.</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search playlists..."
              className="w-full md:w-64 rounded-xl bg-black/40 px-4 py-3 text-white placeholder-white/30 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-teal-500/40"
            />
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 text-black font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
            >
              + Create
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading label="Loading playlists..." />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((playlist) => (
            <div 
              key={playlist.id} 
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-5 hover:border-teal-500/50 transition-all duration-300 group"
            >
              <div className="relative mb-4">
                <img 
                  src={playlist.image} 
                  alt={playlist.title} 
                  className="w-full h-48 object-cover rounded-lg shadow-xl group-hover:shadow-2xl transition-shadow"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{playlist.title}</h3>
                  <p className="text-sm text-gray-300">{playlist.tracks.length} tracks</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                <span className="text-sm text-gray-400">
                  Created {playlist.createdAt ? new Date(playlist.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => playPlaylist(playlist, 'play')}
                    disabled={playlist.tracks.length === 0}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50"
                    title="Play"
                  >
                    <Play className="w-4 h-4 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={() => playPlaylist(playlist, 'shuffle')}
                    disabled={playlist.tracks.length === 0}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50"
                    title="Shuffle"
                  >
                    <Shuffle className="w-4 h-4 text-white" />
                  </button>
                  <Button variant="outline" size="sm" onClick={() => openDetails(playlist)}>
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-400 mb-2">No Playlists Yet</h2>
          <p className="text-gray-500 mb-6">Create your first playlist to get started</p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 text-black font-semibold"
          >
            Create Your First Playlist
          </Button>
        </div>
      )}

      <PlaylistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <Modal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={selected?.title ? `Playlist: ${selected.title}` : 'Playlist'}
        size="xl"
        variant="dark"
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <img
                src={selected.image}
                alt={selected.title}
                className="w-full md:w-56 h-40 object-cover rounded-2xl border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white/60">{selected.tracks.length} tracks</div>
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    onClick={() => playPlaylist(selected, 'play')}
                    disabled={selected.tracks.length === 0}
                    className="bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 text-black font-semibold"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Play className="w-4 h-4" /> Play
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => playPlaylist(selected, 'shuffle')}
                    disabled={selected.tracks.length === 0}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Shuffle className="w-4 h-4" /> Shuffle
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            {selected.tracks.length > 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <TrackList tracks={selected.tracks} loading={false} />
              </div>
            ) : (
              <div className="text-sm text-white/60">No tracks in this playlist yet.</div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default PlaylistsPage;
