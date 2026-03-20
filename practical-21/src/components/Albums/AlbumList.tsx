import React from 'react';
import type { Album } from '../../types/api';
import AlbumCard from './AlbumCard';
import Loading from '../UI/Loading';

interface Props {
  albums: Album[];
  loading: boolean;
  error?: string;
}

const AlbumList: React.FC<Props> = ({ albums, loading, error }) => {

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="text-red-400 text-center py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="py-20">
       <div className="max-w-full pt-10 mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-100 mb-3">
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

