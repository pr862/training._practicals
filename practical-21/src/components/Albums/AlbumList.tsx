import React from 'react';
import type { Album } from '../../types/api';
import AlbumCard from './AlbumCard';
import Loading from '../UI/Loading';

interface Props {
  albums: Album[];
  loading: boolean;
}

const AlbumList: React.FC<Props> = ({ albums, loading }) => {

  if (loading) return <Loading />;

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          All Albums
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumList;

