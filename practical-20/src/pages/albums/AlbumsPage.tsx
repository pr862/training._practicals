import React, { useEffect, useState } from 'react';
import type { Album } from '../../types/album';
import type { Artist } from '../../types/artist';
import { adminAlbumsApi } from '../../api/admin/albums';
import { adminArtistsApi } from '../../api/admin/artists';
import { assetUrl } from '../../lib/assetUrl';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Modal } from '../../components/ui/Modal';
import { AlbumForm, type AlbumFormValues } from '../../components/forms/AlbumForm';
import { useToast } from '../../context/ToastProvider';
import { useConfirm } from '../../context/ConfirmProvider';
import { Edit, Trash2 } from 'lucide-react';

export const AlbumsPage: React.FC = () => {
  const [items, setItems] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();
  const { confirm } = useConfirm();

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeCreate = () => setShowCreate(false);
  const closeEdit = () => {
    setShowEdit(false);
    setEditingAlbum(null);
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const [albumsData, artistsData] = await Promise.all([
        adminAlbumsApi.list(),
        adminArtistsApi.list(),
      ]);
      setItems(albumsData);
      setArtists(artistsData);
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const onCreate = async (values: AlbumFormValues) => {
    setIsSubmitting(true);
    try {
      await adminAlbumsApi.create(values);
      success('Album created');
      closeCreate();
      await refresh();
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to create album');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEdit = async (values: AlbumFormValues) => {
    if (!editingAlbum) return;
    setIsSubmitting(true);
    try {
      await adminAlbumsApi.update(editingAlbum.id, values);
      success('Album updated');
      closeEdit();
      await refresh();
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to update album');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id: number, name: string) => {
    const ok = await confirm({
      title: 'Delete this album?',
      description: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await adminAlbumsApi.remove(id);
      success('Album deleted');
      await refresh();
    } catch (e: any) {
      toastError(e?.message ?? 'Failed to delete album');
    }
  };

  return (
    <div>
      <PageHeader
        title="Albums"
        subtitle="Manage your albums"
        actions={
          <Button variant="accent" onClick={() => setShowCreate(true)}>
            + Add Album
          </Button>
        }
      />

      <Modal
        open={showCreate}
        title="Add Album"
        subtitle="Create a new album"
        onClose={closeCreate}
        footer={null}
      >
        <AlbumForm artists={artists} onSubmit={onCreate} onCancel={closeCreate} isLoading={isSubmitting} />
      </Modal>

      <Modal open={showEdit} title="Edit Album" subtitle="Update album information" onClose={closeEdit} footer={null}>
        {editingAlbum && (
          <AlbumForm
            key={editingAlbum.id}
            album={editingAlbum}
            artists={artists}
            onSubmit={onEdit}
            onCancel={closeEdit}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      <div className="rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur">
        <div className="border-b border-white/10 px-6 py-4 text-sm text-white/60">
          {loading ? 'Loading albums...' : `${items.length} albums`}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm table-auto">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">Cover</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">Album</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">Artist</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider">Published</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm font-medium text-white">{a.id}</td>
                  <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    {assetUrl(a.image_url) ? (
                      <img
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover shadow-sm border border-white/10"
                        src={assetUrl(a.image_url)!}
                        alt={a.name}
                      />
                    ) : (
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <span className="text-xs text-white/40">No cover</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <Link className="text-teal-300 hover:text-teal-200 underline font-medium" to={`/albums/${a.id}`}>
                      {a.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{a.artist?.name ?? a.artist_id ?? '-'}</td>
                  <td className="px-4 py-2 text-sm font-medium text-white max-w-[200px] sm:max-w-sm break-words whitespace-normal">
                    {a.description}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white/80">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${a.is_published
                        ? 'bg-teal-500/15 text-teal-200 border border-teal-400/20'
                        : 'bg-white/5 text-white/60 border border-white/10'
                      }`}>
                      {a.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <Link
                      className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-transparent px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                      to={`/albums/${a.id}`}
                    >
                      Manage Tracks
                    </Link>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setEditingAlbum(a);
                        setShowEdit(true);
                      }}
                      className="px-3 py-1.5 text-xs"
                    >
                      <Edit className="w-5 h-5 text-teal-500" />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => onDelete(a.id, a.name)}
                      className="px-3 py-1.5 text-xs"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </Button>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-white/50" colSpan={7}>
                    No albums found. Create your first album to get started.
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