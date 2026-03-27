import React, { useEffect, useState } from 'react';
import type { Artist } from '../../types/artist';
import { adminArtistsApi } from '../../api/admin/artists';
import { assetUrl } from '../../lib/assetUrl';
import { PageHeader } from '../common/PageHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ArtistForm } from '../../components/forms/ArtistForm';
import { AlertToast } from '../../components/ui/Alert';
import { Edit, Trash2 } from 'lucide-react';
import { useConfirm } from '../../components/ui/ConfirmProvider';

export const ArtistsPage: React.FC = () => {
  const [items, setItems] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>>([]);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirm } = useConfirm();

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await adminArtistsApi.list();
      setItems(data);
    } catch (e: any) {
      addAlert('load-error', 'error', e?.message ?? 'Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const addAlert = (id: string, type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const onCreate = async (data: { name: string; image: File | null }) => {
    setIsSubmitting(true);
    try {
      await adminArtistsApi.create(data);
      setShowCreate(false);
      addAlert('create-success', 'success', 'Artist created successfully');
      await refresh();
    } catch (e: any) {
      addAlert('create-error', 'error', e?.message ?? 'Failed to create artist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEdit = async (data: { name: string; image: File | null }) => {
    if (!editingArtist) return;

    setIsSubmitting(true);
    try {
      await adminArtistsApi.update(editingArtist.id, data);
      setShowEdit(false);
      setEditingArtist(null);
      addAlert('update-success', 'success', 'Artist updated successfully');
      await refresh();
    } catch (e: any) {
      addAlert('update-error', 'error', e?.message ?? 'Failed to update artist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id: number, name: string) => {
    const ok = await confirm({
      title: 'Delete this artist?',
      description: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await adminArtistsApi.remove(id);
      addAlert('delete-success', 'success', 'Artist deleted successfully');
      await refresh();
    } catch (e: any) {
      addAlert('delete-error', 'error', e?.message ?? 'Failed to delete artist');
    }
  };

  const startEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setShowEdit(true);
  };

  return (
    <div>
      <AlertToast alerts={alerts} onDismiss={dismissAlert} />

      <PageHeader
        title="Artists"
        subtitle="Manage your artists"
        actions={
          <Button variant="accent" onClick={() => setShowCreate(true)}>
            + Add Artist
          </Button>
        }
      />

      <Modal
        open={showCreate}
        title="Add Artist"
        subtitle="Create a new artist"
        onClose={() => setShowCreate(false)}
        footer={null}
      >
        <ArtistForm
          onSubmit={onCreate}
          onCancel={() => setShowCreate(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        open={showEdit}
        title="Edit Artist"
        subtitle="Update artist information"
        onClose={() => {
          setShowEdit(false);
          setEditingArtist(null);
        }}
        footer={null}
      >
        {editingArtist && (
          <ArtistForm
            artist={editingArtist}
            onSubmit={onEdit}
            onCancel={() => {
              setShowEdit(false);
              setEditingArtist(null);
            }}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      <div className="rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur">
        <div className="border-b border-white/10 px-6 py-4 text-sm text-white/60">
          {loading ? 'Loading artists...' : `${items.length} artists`}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm table-auto">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{a.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assetUrl(a.image_url) ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover shadow-sm border border-slate-200"
                        src={assetUrl(a.image_url)!}
                        alt={a.name}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <span className="text-xs text-slate-500">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{a.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <Button
                      variant="primary"
                      onClick={() => startEdit(a)}
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
                  <td className="px-6 py-8 text-center text-sm text-slate-500" colSpan={4}>
                    No artists found. Create your first artist to get started.
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