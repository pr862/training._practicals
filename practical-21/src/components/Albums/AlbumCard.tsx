import React from 'react';
import playIcon from '../../assets/play.svg';
import type { Album } from '../../types/api';

interface AlbumCardProps {
  album: Album;
  onClick?: () => void;
  onPlay?: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick, onPlay }) => {

  const image =
    album.image ||
    (album as any).image_url ||
    'https://via.placeholder.com/300';

  const title =
    album.title ||
    (album as any).name ||
    'Unknown Album';

  const artist =
    album.artistName ||
    (album as any).artist_name ||
    (album as any).artist?.name ||
    'Unknown Artist';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'https://via.placeholder.com/300';
  };

  return (
    <div
      onClick={onClick}
      className="group w-52 p-3 rounded-xl flex-shrink-0 cursor-pointer 
      transition-all duration-300 hover:bg-neutral-700/60 hover:scale-[1.03]"
    >

      <div className="relative">
        <img
          src={image}
          alt={title}
          onError={handleImageError}
          className="w-full h-44 object-cover rounded-lg shadow-lg"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.();
          }}
          className="absolute bottom-3 right-3 w-12 h-12 
          bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 
          rounded-full flex items-center justify-center shadow-lg 
          opacity-0 group-hover:opacity-100 translate-y-3 
          group-hover:translate-y-0 transition-all duration-300"
        >
          <img src={playIcon} alt="play" />
        </button>
      </div>

      <div className="mt-3">
        <p className="font-semibold text-sm truncate">
          {title}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {artist}
        </p>
      </div>

    </div>
  );
};

export default AlbumCard;