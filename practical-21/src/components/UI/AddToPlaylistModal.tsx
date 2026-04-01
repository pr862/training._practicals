import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Button from './Button';
import Loading from './Loading';
import { useLibrary } from '../../contexts/Library';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  trackId: number;
  trackTitle?: string;
};

const AddToPlaylistModal: React.FC<Props> = ({ isOpen, onClose, trackId, trackTitle }) => {
  const navigate = useNavigate();
  const { playlists, playlistsLoading, playlistsError, addTrackToPlaylist } = useLibrary();
  const [savingId, setSavingId] = useState<number | null>(null);

  const title = useMemo(() => {
    const base = 'Add to playlist';
    return trackTitle ? `${base}: ${trackTitle}` : base;
  }, [trackTitle]);

  const handleAdd = async (playlistId: number) => {
    setSavingId(playlistId);
    const playlist = playlists.find((item) => item.id === playlistId);
    await addTrackToPlaylist(playlistId, trackId, playlist?.title, trackTitle);
    onClose();
    setSavingId(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md" variant="dark">
      {playlistsLoading ? (
        <Loading />
      ) : playlistsError ? (
        <div className="text-sm text-rose-300">{playlistsError}</div>
      ) : playlists.length === 0 ? (
        <div className="space-y-3">
          <div className="text-sm text-white/70">No playlists yet.</div>
          <Button
            onClick={() => {
              onClose();
              navigate('/app/playlists');
            }}
          >
            Create a playlist
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {playlists.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => void handleAdd(p.id)}
              disabled={savingId !== null}
              className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition-colors disabled:opacity-60"
            >
              <span className="truncate">{p.title}</span>
              <span className="text-xs text-white/60">
                {savingId === p.id ? 'Adding…' : 'Add'}
              </span>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default AddToPlaylistModal;
