import React, { useEffect, useState } from 'react';
import type { Track } from '../../types/track';
import type { Album } from '../../types/album';
import { adminTracksApi } from '../../api/admin/tracks';
import { adminAlbumsApi } from '../../api/admin/albums';
import { PageHeader } from '../common/PageHeader';
import { Button } from '../../components/ui/Button';
import { assetUrl } from '../../lib/assetUrl';
import { Modal } from '../../components/ui/Modal';
import { TrackForm, type TrackFormValues } from '../../components/forms/TrackForm';
import { useToast } from '../../components/ui/ToastProvider';
import { useConfirm } from '../../components/ui/ConfirmProvider';
import { Edit, Trash2 } from 'lucide-react';

export const TracksPage: React.FC = () => {
  const [items, setItems] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();
  const { confirm } = useConfirm();

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeCreate = () => setShowCreate(false);
  const closeEdit = () => {
    setShowEdit(false);
    setEditingTrack(null);
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const [tracksData, albumsData] = await Promise.all([adminTracksApi.list(), adminAlbumsApi.list()]);
      setItems(tracksData);
      setAlbums(albumsData);
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to load tracks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const onCreate = async (values: TrackFormValues) => {
    setIsSubmitting(true);
    try {
      await adminTracksApi.create(values);
      success('Track created');
      closeCreate();
      await refresh();
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to create track');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEdit = async (values: TrackFormValues) => {
    if (!editingTrack) return;
    setIsSubmitting(true);
    try {
      await adminTracksApi.update(editingTrack.id, values);
      success('Track updated');
      closeEdit();
      await refresh();
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to update track');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id: number, name: string) => {
    const ok = await confirm({
      title: 'Delete this track?',
      description: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await adminTracksApi.remove(id);
      success('Track deleted');
      await refresh();
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to delete track');
    }
  };

  return (
    <div>
      <PageHeader
        title="Tracks"
        subtitle="Manage your tracks"
        actions={<Button variant="accent" onClick={() => setShowCreate(true)}>+ Add Track</Button>}
      />

      <Modal open={showCreate} title="Add Track" subtitle="Create a new track" onClose={closeCreate} footer={null}>
        <TrackForm albums={albums} onSubmit={onCreate} onCancel={closeCreate} isLoading={isSubmitting} />
      </Modal>

      <Modal open={showEdit} title="Edit Track" subtitle="Update track information" onClose={closeEdit} footer={null}>
        {editingTrack && (
          <TrackForm
            key={editingTrack.id}
            track={editingTrack}
            albums={albums}
            onSubmit={onEdit}
            onCancel={closeEdit}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      <div className="rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur">
        <div className="border-b border-white/10 px-6 py-4 text-sm text-white/60">
          {loading ? 'Loading tracks...' : `${items.length} tracks`}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm table-auto">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">Cover</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">Track</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">Album</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">Index</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">Published</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm font-medium text-white">{t.id}</td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    {assetUrl(t.image_url) ? (
                      <img className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover shadow-sm border border-white/10" src={assetUrl(t.image_url)!} alt={t.name} />
                    ) : (
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <span className="text-xs text-white/40">No cover</span>
                      </div>
                    )}
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm text-white">{t.name}</td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm text-white/80">{t.album?.name ?? t.album_id ?? '-'}</td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm text-white/80">{t.index ?? '-'}</td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-white">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${t.is_published ? 'bg-teal-500/15 text-teal-200 border border-teal-400/20' : 'bg-white/5 text-white/60 border border-white/10'}`}>
                      {t.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm space-x-2">
                    <Button variant="primary" size="sm" className="mr-2" onClick={() => { setEditingTrack(t); setShowEdit(true); }}>
                      <Edit className="w-5 h-5 text-teal-500" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => onDelete(t.id, t.name)}>
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </Button>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-white/50" colSpan={7}>
                    No tracks found. Create your first track to get started.
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