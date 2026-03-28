import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Playlist } from '../../types/playlist';
import { adminPlaylistsApi } from '../../api/admin/playlists';
import { assetUrl } from '../../lib/assetUrl';
import { PageHeader } from '../common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { PlaylistForm, type PlaylistFormValues } from '../../components/forms/PlaylistForm';
import { useToast } from '../../components/ui/ToastProvider';
import { useConfirm } from '../../components/ui/ConfirmProvider';
import { Edit, Trash2 } from 'lucide-react';

export const PlaylistsPage: React.FC = () => {
  const [items, setItems] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();
  const { confirm } = useConfirm();

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeCreate = () => setShowCreate(false);
  const closeEdit = () => {
    setShowEdit(false);
    setEditingPlaylist(null);
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await adminPlaylistsApi.list();
      setItems(data);
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const onCreate = async (values: PlaylistFormValues) => {
    setIsSubmitting(true);
    try {
      await adminPlaylistsApi.create(values);
      success('Playlist created');
      closeCreate();
      await refresh();
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to create playlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEdit = async (values: PlaylistFormValues) => {
    if (!editingPlaylist) return;
    setIsSubmitting(true);
    try {
      await adminPlaylistsApi.update(editingPlaylist.id, values);
      success('Playlist updated');
      closeEdit();
      await refresh();
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to update playlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id: number, name: string) => {
    const ok = await confirm({
      title: 'Delete this playlist?',
      description: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await adminPlaylistsApi.remove(id);
      success('Playlist deleted');
      await refresh();
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to delete playlist');
    }
  };

  return (
    <div>
      <PageHeader
        title="Playlists"
        subtitle="Manage your playlists"
        actions={
          <Button variant="accent" onClick={() => setShowCreate(true)}>
            + Add Playlist
          </Button>
        }
      />

      <Modal
        open={showCreate}
        title="Add Playlist"
        subtitle="Create a new playlist"
        onClose={closeCreate}
        footer={null}
      >
        <PlaylistForm onSubmit={onCreate} onCancel={closeCreate} isLoading={isSubmitting} />
      </Modal>

      <Modal open={showEdit} title="Edit Playlist" subtitle="Update playlist information" onClose={closeEdit} footer={null}>
        {editingPlaylist && (
          <PlaylistForm
            key={editingPlaylist.id}
            playlist={editingPlaylist}
            onSubmit={onEdit}
            onCancel={closeEdit}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      <div className="rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur">
        <div className="border-b border-white/10 px-6 py-4 text-sm text-white/60">
          {loading ? 'Loading playlists...' : `${items.length} playlists`}
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Cover</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Playlist</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{p.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assetUrl(p.image_url) ? (
                      <img 
                        className="h-12 w-12 rounded-xl object-cover shadow-sm border border-white/10"
                        src={assetUrl(p.image_url)!} 
                        alt={p.name} 
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <span className="text-xs text-white/40">No cover</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <Link className="text-teal-300 hover:text-teal-200 underline font-medium" to={`/playlists/${p.id}`}>
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-sm font-medium text-white max-w-[200px] sm:max-w-xs break-words whitespace-normal">
                    {p.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      p.is_published 
                        ? 'bg-teal-500/15 text-teal-200 border border-teal-400/20' 
                        : 'bg-white/5 text-white/60 border border-white/10'
                    }`}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <Link
                      className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-transparent px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                      to={`/playlists/${p.id}`}
                    >
                      Manage Tracks
                    </Link>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setEditingPlaylist(p);
                        setShowEdit(true);
                      }}
                      className="px-3 py-1.5 text-xs"
                    >
                      <Edit className="w-5 h-5 text-teal-500" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => onDelete(p.id, p.name)}
                      className="px-3 py-1.5 text-xs"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </Button>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-white/50" colSpan={5}>
                    No playlists found. Create your first playlist to get started.
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