import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Artist } from '../../types/api';

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/app/artists/${artist.id}`)}
      className="group cursor-pointer text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:shadow-xl border hover:border-purple-200"
    >
      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-indigo-400 to-purple-600 p-2">
        <img 
          src={artist.image} 
          alt={artist.name} 
          className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" 
        />
      </div>
      <h3 className="font-bold text-xl mb-1 line-clamp-2">{artist.name}</h3>
      {artist.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{artist.description}</p>
      )}
    </div>
  );
};

export default ArtistCard;
