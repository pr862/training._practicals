import React from 'react';
import { useAlbums } from '../hooks/useAlbums';
import AlbumList from '../components/Albums/AlbumList';

const AlbumsPage: React.FC = () => {
  const { albums, loading, error } = useAlbums();

  return (
    <div className="p-6 space-y-6">
      {error && <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>}
      <AlbumList albums={albums} loading={loading} />
    </div>
  );
};

export default AlbumsPage;

