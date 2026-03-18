import React from 'react';
import type { Album } from '../../types/api';

interface AlbumCardProps {
  album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  return (
    <div className="group cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border hover:border-blue-200 flex flex-col h-full">
      <div className="mb-4 relative">
        <img src={album.image} alt={album.title} className="w-full h-52 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{album.title}</h3>
        <p className="text-gray-600 mb-2">{album.artist.name}</p>
        <p className="text-sm text-gray-500">{album.year} • {album.tracks.length} songs</p>
      </div>
    </div>
  );
};

export default AlbumCard;
