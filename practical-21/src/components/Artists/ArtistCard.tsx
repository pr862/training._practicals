import React from "react";
import { useNavigate } from "react-router-dom";
import type { Artist } from "../../types/api";
import playIcon from "../../assets/play.svg";

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const navigate = useNavigate();
  const nameInitial = artist?.name?.charAt(0)?.toUpperCase() ?? 'A';

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src =
      "https://via.placeholder.com/300x300/667eea/ffffff?text=" +
      encodeURIComponent(nameInitial);
  };

  const fallbackSrc =
    "https://via.placeholder.com/300x300/667eea/ffffff?text=" +
    encodeURIComponent(nameInitial);

  return (
    <div
      className="group w-52 p-3 rounded-xl flex-shrink-0 cursor-pointer text-center
        transition-all duration-300 hover:bg-neutral-700/60 hover:scale-[1.03]"
    >
      {/* Image */}
      <div
        className="relative flex justify-center"
        onClick={() => artist?.id && navigate(`/app/artists/${artist.id}`)}
      >
        <img
          src={artist.image || fallbackSrc}
          alt={artist.name || 'Artist'}
          onError={handleImageError}
          className="w-40 h-40 rounded-full object-cover shadow-lg"
        />

        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent parent click
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

      <p
        className="mt-4 text-base font-semibold truncate text-white cursor-pointer hover:underline"      >
        {artist.name || 'Unknown Artist'}
      </p>
      <p className="text-sm text-gray-400">Artist</p>
    </div>
  );
};

export default ArtistCard;

