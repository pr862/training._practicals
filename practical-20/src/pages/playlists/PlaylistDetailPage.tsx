import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminPlaylistsApi } from '../../api/admin/playlists';
import { adminTracksApi } from '../../api/admin/tracks';
import type { PlaylistDetail } from '../../types/playlist';
import type { Track } from '../../types/track';
import { PageHeader } from '../../components/ui/PageHeader';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastProvider';
import { useConfirm } from '../../context/ConfirmProvider';
import { Trash2, MoveLeft } from 'lucide-react';

export const PlaylistDetailPage: React.FC = () => {
  const playlistId = Number(useParams().playlistId);
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [trackId, setTrackId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();
  const { confirm } = useConfirm();

  const refresh = async () => {
    setLoading(true);
    try {
      const [p, tracks] = await Promise.all([
        adminPlaylistsApi.get(playlistId),
        adminTracksApi.list()
      ]);
      setPlaylist(p);
      setAllTracks(tracks);
      setTrackId(null);
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(playlistId)) return;
    void refresh();
  }, [playlistId]);

  const assignedTracks = useMemo(() => playlist?.tracks ?? [], [playlist]);

  const unassignedTracks = useMemo(
    () => allTracks.filter((t) => !assignedTracks.some((at) => at.id === t.id)),
    [allTracks, assignedTracks]
  );

  const canAdd = unassignedTracks.length > 0;

  const onAdd = async () => {
    if (!trackId) return;
    try {
      await adminPlaylistsApi.addTrack(playlistId, trackId);
      setShowAdd(false);
      success('Track added to playlist');
      await refresh();
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to add track');
    }
  };

  const onRemove = async (id: number) => {
    const ok = await confirm({
      title: 'Remove track from playlist?',
      description: 'This will remove the track from this playlist only.',
      confirmText: 'Remove',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await adminPlaylistsApi.removeTrack(playlistId, id);
      success('Track removed from playlist');
      await refresh();
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to remove track');
    }
  };

  if (!Number.isFinite(playlistId)) return <div>Invalid playlist id</div>;

  return (
    <div>
      <PageHeader
        title={playlist ? `Playlist: ${playlist.name}` : 'Playlist'}
        subtitle="Manage tracks in this playlist"
        actions={
          <Button
            variant="accent"
            className="rounded-full px-4"
            disabled={!canAdd || loading}
            onClick={() => {
              setTrackId(null);
              setShowAdd(true);
            }}
          >
            + Add Track
          </Button>
        }
      />

      <div className="mb-4 text-sm">
        <Link className="underline text-white/70 hover:text-white" to="/playlists">
          <MoveLeft className="w-5 h-5 text-white" />
        </Link>
      </div>

      <Modal
        open={showAdd}
        title="Add Track"
        subtitle="Add an existing track to this playlist"
        onClose={() => setShowAdd(false)}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button variant="accent" disabled={!trackId || loading || !canAdd} onClick={onAdd}>
              Add
            </Button>
          </div>
        }
      >
        {!canAdd ? (
          <div className="text-sm text-white/60">No available tracks to add.</div>
        ) : (
          <div className="grid gap-4">
            <Select
              label="Track"
              value={trackId ?? ''}
              onChange={(e) => setTrackId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="" disabled hidden>
                Select track
              </option>
              {unassignedTracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>
        )}
      </Modal>

      <div className="rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur">
        <div className="border-b border-white/10 p-3 text-sm text-white/60">
          {loading ? 'Loading...' : `${assignedTracks.length} tracks in playlist`}
        </div>
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Index</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Track</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedTracks.map((t, i) => (
                <tr key={t.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white">{t.index ?? i + 1}</td>
                  <td className="px-3 py-2 text-sm text-white/80">{t.name}</td>
                  <td className="px-3 py-2 text-right text-sm">
                    <Button variant="secondary" size="sm" onClick={() => onRemove(t.id)}>
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </Button>
                  </td>
                </tr>
              ))}
              {!loading && assignedTracks.length === 0 && (
                <tr>
                  <td className="p-3 text-white/50" colSpan={3}>
                    No tracks assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};