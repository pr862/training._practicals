import React from "react";
import { useNavigate } from "react-router-dom";
import type { Album } from "../../types/api";
import playIcon from "../../assets/play.svg";

interface AlbumCardProps {
  album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const navigate = useNavigate();
  const titleInitial = album?.title?.charAt(0)?.toUpperCase() ?? 'A';

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src =
      "https://via.placeholder.com/300x300/1db954/ffffff?text=" +
      encodeURIComponent(titleInitial);
  };

  const fallbackSrc =
    "https://via.placeholder.com/300x300/1db954/ffffff?text=" +
    encodeURIComponent(titleInitial);

  return (
    <div
      onClick={() => navigate(`/app/albums/${album.id}`)}
      className="group w-52 p-3 rounded-xl flex-shrink-0 cursor-pointer text-center transition-all duration-300 hover:bg-neutral-700/60 hover:scale-[1.03]">
      <div className="relative">
        <img
          src={album.image || fallbackSrc}
          alt={album.title || 'Album'}
          onError={handleImageError}
          className="w-44 h-44 rounded-xl object-cover shadow-md"
        />

        <button
          onClick={(e) => {
            e.stopPropagation(); 
          }}
          className="absolute bottom-3 right-3 w-12 h-12 
            bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 
            rounded-full flex items-center justify-center shadow-lg 
            opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 
            transition-all duration-300 hover:scale-105"
        >
          <img src={playIcon} alt="play" className="w-4 h-4" />
        </button>
      </div>

      <p className="mt-3 text-sm font-semibold text-white truncate">{album.title}</p>
      <p className="text-xs text-gray-400 truncate">{album.artistName}</p>
    </div>
  );
};

export default AlbumCard;